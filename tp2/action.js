
// Récupération des paramètres de l’URL
const params = new URLSearchParams(window.location.search);

// Extraction des valeurs envoyées
const name = params.get("name");
const firstname = params.get("firstname");
const birthday = params.get("birthday");
const address = params.get("address");
const email = params.get("email");

// Sélection du conteneur d'affichage
const result = document.getElementById("result");

// Vérifie si des données sont présentes
if (name && firstname && birthday && address && email) {
  // Affiche les données reçues
  result.innerHTML = `
    <p><strong>Nom :</strong> ${name}</p>
    <p><strong>Prénom :</strong> ${firstname}</p>
    <p><strong>Date de naissance :</strong> ${birthday}</p>
    <p><strong>Adresse :</strong> 
      <a href="https://www.google.com/maps/search/${encodeURIComponent(address)}" target="_blank">${address}</a>
    </p>
    <p><strong>Email :</strong> 
      <a href="mailto:${email}">${email}</a>
    </p>
  `;
} else {
  // Si aucune donnée reçue
  result.innerHTML = `<p>Aucune donnée reçue.</p>`;
}
