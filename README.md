# UA Phantom

UA Phantom est une extension Firefox expérimentale orientée confidentialité.

## Objectif

L’extension permet de modifier le User-Agent visible par les sites web à deux niveaux :

- le User-Agent envoyé dans les requêtes HTTP ;
- le User-Agent lu côté JavaScript via `navigator.userAgent`.

## Fonctionnement

La solution repose sur deux parties :

- `background.js` : intercepte les requêtes HTTP avec `webRequest.onBeforeSendHeaders` et remplace le header `User-Agent`.
- `content_script.js` : récupère le même User-Agent depuis le background script, puis injecte un script dans la page afin de modifier `navigator.userAgent`.

## Version

V1 - 07/05/2026

Dans cette première version, nous avons validé :

- la modification du User-Agent côté HTTP ;
- la modification de `navigator.userAgent` côté page ;
- la communication entre `background.js` et `content_script.js` ;
- la cohérence entre le header HTTP et la valeur JavaScript visible par le site.

## Statut

Projet expérimental à but éducatif.
