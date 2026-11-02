(() => {
  const config = globalThis.NAKUPNA_BRZDA_CONFIG;

  if (!config || !globalThis.chrome?.storage?.local) {
    return;
  }

  const toggle = document.getElementById("enabled-toggle");
  const statusText = document.getElementById("status-text");

  loadState();
  toggle.addEventListener("change", handleToggleChange);

  function loadState() {
    chrome.storage.local.get(config.storageKey, (stored) => {
      const savedSettings = stored[config.storageKey] || {};
      const enabled = savedSettings.enabled ?? config.defaultSettings.enabled;

      toggle.checked = enabled;
      renderStatus(enabled);
    });
  }

  function handleToggleChange() {
    const nextSettings = {
      enabled: toggle.checked
    };

    chrome.storage.local.set({
      [config.storageKey]: nextSettings
    }, () => {
      renderStatus(toggle.checked);
    });
  }

  function renderStatus(enabled) {
    statusText.textContent = enabled
      ? "Blokovanie impulzivneho nakupu je zapnute."
      : "Blokovanie impulzivneho nakupu je vypnute.";
  }
})();
