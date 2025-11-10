// gps.js

// Fonction appelée au clic sur le bouton GPS
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnGPS").addEventListener("click", getLocation);
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("La géolocalisation n'est pas supportée par ce navigateur.");
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Afficher la carte
  const mapDiv = document.getElementById("map");
  mapDiv.style.display = "block";
  mapDiv.innerHTML = ""; // réinitialiser avant d'afficher une nouvelle carte

  // Initialiser la carte Leaflet
  const map = L.map("map").setView([lat, lon], 15);

  // Ajouter la couche OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  // Ajouter un marqueur à la position de l'utilisateur
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup("<b>Vous êtes ici</b>").openPopup();

  // 🔍 Optionnel : obtenir l’adresse à partir des coordonnées (reverse geocoding)
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.display_name) {
        document.getElementById("address").value = data.display_name;
      }
    })
    .catch((error) => console.error("Erreur reverse geocoding :", error));
}

function showError(error) {
  let msg = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = "Permission refusée.";
      break;
    case error.POSITION_UNAVAILABLE:
      msg = "Position non disponible.";
      break;
    case error.TIMEOUT:
      msg = "Délai dépassé.";
      break;
    default:
      msg = "Erreur inconnue.";
  }
  alert(msg);
}
