const fakeUserAgents = [
  // 0 - Chrome Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

  // 1 - Firefox Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",

  // 2 - Edge Windows
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",

  // 3 - Chrome macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

  // 4 - Safari macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",

  // 5 - Firefox macOS
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13.6; rv:121.0) Gecko/20100101 Firefox/121.0",

  // 6 - Chrome Linux
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",

  // 7 - Firefox Linux
  "Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",

  // 8 - Chrome Android
  "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",

  // 9 - Safari iPhone
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",

];


let avantTraitement = Math.random() * 10;
let traiter = Math.floor(avantTraitement);

console.log(fakeUserAgents[traiter]);
// TESTER CA MARCHE // POUR LA SUITE // 07/05/2026

browser.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "user-agent") {
        header.value = fakeUserAgents[traiter];
      }
    }

    return {
      requestHeaders: details.requestHeaders
    };
  },
  {
    urls: ["<all_urls>"]
  },
  ["blocking", "requestHeaders"]
);
// Envoie un message depuis le content script vers le background script.
// Attention : ici il y a une faute de frappe, c’est écrit "sendMessahe" au lieu de "sendMessage".
browser.runtime.sendMessahe({

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