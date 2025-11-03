
// gps.js
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.querySelector("#map").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  var img_url = `https://maps.googleapis.com/maps/api/staticmap?center=${latlon}&zoom=14&size=400x300&scale=2&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg`;

  document.querySelector("#map").innerHTML = `<img src='${img_url}' class='img-fluid mx-auto d-block rounded'>`;
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.querySelector("#map").innerHTML = "Permission refusée.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.querySelector("#map").innerHTML = "Position non disponible.";
      break;
    case error.TIMEOUT:
      document.querySelector("#map").innerHTML = "Délai dépassé.";
      break;
    default:
      document.querySelector("#map").innerHTML = "Erreur inconnue.";
  }
}
