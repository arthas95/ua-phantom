// Envoie un message depuis le content script vers le background script.
browser.runtime.sendMessage({
    type: "GET_USER_AGENT"
}).then((response) => {

    // User-Agent récupéré depuis le background
    const fakeUserAgent = response.userAgent;

    // Fuseau horaire simulé
    const fakeTimeZone = "America/New_York";

    // Offset simulé
    // New York UTC-5 = 300
    // Paris UTC+1 = -60
    // Paris UTC+2 = -120
    const fakeOffset = 300;

    console.log("User agent récupéré :", fakeUserAgent);

    // Création de la balise script
    const script = document.createElement("script");

    // Code injecté dans le vrai contexte de la page
    script.textContent = `
(function() {

    const fakeUserAgent = ${JSON.stringify(fakeUserAgent)};
    const fakeTimeZone = ${JSON.stringify(fakeTimeZone)};
    const fakeOffset = ${JSON.stringify(fakeOffset)};

    // =========================
    // SPOOF USER-AGENT
    // =========================

    Object.defineProperty(navigator, "userAgent", {
        get: function() {
            return fakeUserAgent;
        },
        configurable: true
    });

    // =========================
    // SPOOF TIMEZONE
    // =========================

    const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;

    Intl.DateTimeFormat.prototype.resolvedOptions = function() {
        const options = originalResolvedOptions.call(this);

        return {
            ...options,
            timeZone: fakeTimeZone
        };
    };

    Date.prototype.getTimezoneOffset = function() {
        return fakeOffset;
    };

    console.log("[Extension] User-Agent simulé :", navigator.userAgent);
    console.log("[Extension] Fuseau horaire simulé :", fakeTimeZone);
    console.log("[Extension] Offset simulé :", new Date().getTimezoneOffset());

})();
`;

    // Injection du script dans la page
    document.documentElement.appendChild(script);

    // Nettoyage
    script.remove();

}).catch((error) => {
    console.error("Erreur récupération User-Agent :", error);
});