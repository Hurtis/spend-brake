(() => {
  const config = globalThis.NAKUPNA_BRZDA_CONFIG;

  if (!config || !globalThis.chrome?.storage?.local) {
    return;
  }

  const bypassElements = new WeakSet();
  const state = {
    enabled: config.defaultSettings.enabled,
    blocking: false,
    modalOpen: false,
    modalElements: null,
    pendingElement: null,
  };
  let modalTemplatePromise = null;

  initialize();

  function initialize() {
    loadSettings();
    chrome.storage.onChanged.addListener(handleStorageChange);
    document.addEventListener("click", handleClick, true);
  }

  function loadSettings() {
    chrome.storage.local.get(config.storageKey, stored => {
      if (chrome.runtime.lastError) {
        return;
      }

      const savedSettings = stored[config.storageKey] || {};
      state.enabled = savedSettings.enabled ?? config.defaultSettings.enabled;
    });
  }

  function handleStorageChange(changes, areaName) {
    if (areaName !== "local" || !changes[config.storageKey]) {
      return;
    }

    const nextValue = changes[config.storageKey].newValue || {};
    state.enabled = nextValue.enabled ?? config.defaultSettings.enabled;
  }

  function handleClick(event) {
    if (!state.enabled || state.blocking || event.defaultPrevented) {
      return;
    }

    const clickableElement = findClickableCandidate(event.target);
    if (!clickableElement) {
      return;
    }

    if (bypassElements.has(clickableElement)) {
      bypassElements.delete(clickableElement);
      return;
    }

    if (!matchesTrigger(clickableElement)) {
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();

    state.pendingElement = clickableElement;
    state.blocking = true;
    openModal().catch(() => {
      state.pendingElement = null;
      closeModal();
    });
  }

  function findClickableCandidate(target) {
    if (!(target instanceof Element)) {
      return null;
    }

    return target.closest(config.selectors.join(","));
  }

  function matchesTrigger(element) {
    const candidates = collectCandidateStrings(element);
    return candidates.some(candidate => {
      const normalizedCandidate = normalize(candidate);
      if (!normalizedCandidate) {
        return false;
      }

      return config.triggerPatterns.some(pattern => {
        return normalizedCandidate.includes(normalize(pattern));
      });
    });
  }

  function collectCandidateStrings(element) {
    const values = [
      element.textContent,
      element.getAttribute("aria-label"),
      element.getAttribute("title"),
    ];

    if (element instanceof HTMLInputElement) {
      values.push(element.value);
    }

    return values.filter(Boolean);
  }

  function normalize(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase();
  }

  async function openModal() {
    closeModal();

    const templateMarkup = await getModalTemplateMarkup();
    const templateDocument = new DOMParser().parseFromString(templateMarkup, "text/html");
    const overlay = templateDocument.querySelector(".nakupna-brzda-overlay");
    const questionsList = templateDocument.querySelector("[data-role='questions']");
    const cancelButton = templateDocument.querySelector("[data-action='cancel']");
    const continueButton = templateDocument.querySelector("[data-action='continue']");

    if (!overlay || !questionsList || !cancelButton || !continueButton) {
      throw new Error("Modal template is missing required elements.");
    }

    questionsList.textContent = "";
    for (const question of config.reflectionQuestions) {
      const item = document.createElement("li");
      item.textContent = question;
      questionsList.appendChild(item);
    }

    cancelButton.addEventListener("click", () => {
      state.pendingElement = null;
      closeModal();
    });

    continueButton.addEventListener("click", () => {
      continueOriginalAction();
    });

    overlay.addEventListener("click", event => {
      if (event.target === overlay) {
        state.pendingElement = null;
        closeModal();
      }
    });

    document.addEventListener("keydown", handleEscape, true);
    document.documentElement.appendChild(overlay);

    state.modalOpen = true;
    state.modalElements = { overlay, continueButton };
    continueButton.focus();
  }

  function continueOriginalAction() {
    const targetElement = state.pendingElement;
    state.pendingElement = null;
    closeModal();

    if (!targetElement || !targetElement.isConnected) {
      return;
    }

    bypassElements.add(targetElement);
    targetElement.click();
  }

  function handleEscape(event) {
    if (event.key !== "Escape" || !state.modalOpen) {
      return;
    }

    state.pendingElement = null;
    closeModal();
  }

  function closeModal() {
    if (state.modalElements?.overlay?.isConnected) {
      state.modalElements.overlay.remove();
    }

    document.removeEventListener("keydown", handleEscape, true);
    state.blocking = false;
    state.modalOpen = false;
    state.modalElements = null;
  }

  function getModalTemplateMarkup() {
    if (!modalTemplatePromise) {
      modalTemplatePromise = fetch(chrome.runtime.getURL(config.templatePath)).then(response => {
        if (!response.ok) {
          throw new Error(`Cannot load modal template: ${response.status}`);
        }

        return response.text();
      });
    }

    return modalTemplatePromise;
  }
})();
