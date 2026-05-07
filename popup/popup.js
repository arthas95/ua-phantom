document.getElementById("save").addEventListener("click", () => {
  const tz = document.getElementById("tz").value;
  browser.storage.local.set({ fakeTimezone: tz }).then(() => {
    // recharger l'onglet actif pour appliquer
    browser.tabs.reload();
  });
});
