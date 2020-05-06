console.log(
    "SW: Il se passe quelque chose ici !"
  );

  self.addEventListener("install", event => {
    console.log("SW: Installation en cours.");

    // Un Service Worker a fini d'être
    // installé quand la promesse dans
    // `event.waitUntil` est résolue
    event.waitUntil(
        // Création d'une promesse
        // factice qui est résolue au
        // bout d'une seconde.
        // Nous verrons dans l'article
        // suivant par quoi remplacer
        // cette promesse
        new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("SW: Installé.");
                resolve();
            }, 1000);
        })
    );
});