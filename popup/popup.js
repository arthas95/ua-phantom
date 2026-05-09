// Récupération des éléments HTML
const userAgentElement = document.getElementById("userAgent");
const timezoneElement = document.getElementById("timezone");
const localTimeElement = document.getElementById("localTime");
const copyButton = document.getElementById("copyUserAgent");

// Fonction pour afficher le fuseau horaire
function afficherFuseauHoraire() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  timezoneElement.textContent = timezone;
}

// Fonction pour afficher l'heure locale
function afficherHeureLocale() {
  const maintenant = new Date();

  localTimeElement.textContent = maintenant.toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "medium"
  });
}

// Fonction pour récupérer le User-Agent depuis le background
function recupererUserAgent() {
  browser.runtime.sendMessage({
    type: "GET_USER_AGENT"
  }).then((response) => {
    if (response && response.userAgent) {
      userAgentElement.textContent = response.userAgent;
    } else {
      userAgentElement.textContent = "Aucun User-Agent reçu depuis le background.";
    }
  }).catch((error) => {
    console.error("Erreur récupération User-Agent :", error);
    userAgentElement.textContent = "Erreur lors de la récupération du User-Agent.";
  });
}

// Copier le User-Agent dans le presse-papiers
copyButton.addEventListener("click", () => {
  const userAgent = userAgentElement.textContent;

  navigator.clipboard.writeText(userAgent).then(() => {
    copyButton.textContent = "Copié";

    setTimeout(() => {
      copyButton.textContent = "Copier le User-Agent";
    }, 1500);
  });
});

// Initialisation de la popup
recupererUserAgent();
afficherFuseauHoraire();
afficherHeureLocale();

// Mise à jour de l'heure toutes les secondes
setInterval(afficherHeureLocale, 1000);