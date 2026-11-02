(() => {
  const extensionConfig = {
    storageKey: "nakupna_brzda_settings",
    defaultSettings: {
      enabled: true,
    },
    triggerPatterns: [
      "Pridat do kosika",
      "Pridať do košíka",
      "Do Alzaboxu",
      "Do kosika",
      "Do košíka",
      "Kupit",
      "Kúpiť",
      "Přidat do košíku",
      "Pridat do kosiku",
      "Do košíku",
      "Do kosiku",
      "Koupit",
      "Objednat",
      "In den Warenkorb",
      "Zum Warenkorb hinzufügen",
      "Zum Warenkorb hinzufuegen",
      "In die Einkaufstasche",
      "Kaufen",
      "Bestellen",
      "Buy now",
      "Add to cart",
    ],
    reflectionQuestions: [
      "Skutocne danu vec potrebujes?",
      "Mas na nu miesto?",
      "Pouzijes ju aj o mesiac?",
      "Nekupujes ju len preto, ze je v akcii?",
    ],
    templatePath: "modal-template.html",
    selectors: [
      "button",
      "a",
      "input[type='button']",
      "input[type='submit']",
      "[role='button']",
    ],
  };

  globalThis.NAKUPNA_BRZDA_CONFIG = extensionConfig;
})();
