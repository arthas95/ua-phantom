// Envoie un message depuis le content script vers le background script.

browser.runtime.sendMessage({

    // Le message envoyé contient un champ "type".
    // Ici, on dit au background : "je veux récupérer le User-Agent choisi".
    type: "GET_USER_AGENT"

// Quand le background répond, le résultat arrive dans "response".
}).then((response) => {

    // On récupère dans la réponse la propriété "userAgent".
    // Cette valeur est ensuite stockée dans la variable fakeUserAgent.
    const fakeUserAgent = response.userAgent;

    // Affiche dans la console le User-Agent récupéré depuis le background.
    console.log("User agent récupéré :", fakeUserAgent);

    // On prépare le contenu JavaScript qui sera injecté dans la page.
    // Ce script va modifier navigator.userAgent côté page.
    script.textContent = `

  // Redéfinit la propriété navigator.userAgent.
  // Object.defineProperty permet de modifier le comportement d’une propriété.
  Object.defineProperty(navigator, "userAgent", {

    // Le getter est une fonction appelée quand la page lit navigator.userAgent.
    get: function() {

      // Retourne le faux User-Agent récupéré depuis le background.
      return ${JSON.stringify(fakeUserAgent)};
    },

    // configurable: true signifie que cette propriété pourra être redéfinie plus tard.
    configurable: true
  });

  // Affiche dans la console de la page le User-Agent après modification.
  console.log("navigator.userAgent modifié :", navigator.userAgent);
`;

    // Ajoute le script dans la page HTML.
    // C’est ce qui permet d’exécuter le code dans le contexte de la page.
    document.documentElement.appendChild(script);

    // Supprime la balise script après exécution.
    // Le code a déjà été exécuté, donc on nettoie le DOM.
    script.remove();
});