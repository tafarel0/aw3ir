
// js/main.js
// Remplacez ces clés par les vôtres
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // <-- mettre votre clé OpenWeatherMap
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // <-- optionnel, pour afficher la carte statique

var app;
window.onload = function () {
app = new Vue({
el: '#weatherApp',
data: {
loaded: false,
formCityName: '',
message: 'WebApp Loaded.',
messageForm: '',
cityList: [ { name: 'Paris' } ],
cityWeather: null,
cityWeatherLoading: false,
},
mounted: function () {
this.loaded = true;
this.readData();
},
computed: {
googleStaticMapUrl: function () {
if (!this.cityWeather || !this.cityWeather.coord) return '';
const lat = this.cityWeather.coord.lat;
const lon = this.cityWeather.coord.lon;
// Si vous n'avez pas de clé Google Maps, la plupart des navigateurs afficheront une image 'access denied' ou vide
if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
// Utiliser OpenStreetMap static tile via mapbox (sans clé) — simple fallback
return 'https://static-maps.yandex.ru/1.x/?ll=' + lon + ',' + lat + '&size=450,300&z=8&l=map&pt=' + lon + ',' + lat + ',pm2rdm';
}
return 'https://maps.googleapis.com/maps/api/staticmap?center=' + lat + ',' + lon + '&markers=' + lat + ',' + lon + '&zoom=8&size=450x300&scale=2&key=' + GOOGLE_MAPS_API_KEY;
},
weatherIconClass: function () {
if (!this.cityWeather || !this.cityWeather.weather) return '';
// Utilise la classe wi-owm-N où N = id
const id = this.cityWeather.weather[0].id;
return 'wi wi-owm-' + (this.isDay() ? 'day-' + id : 'night-' + id);
}
},
methods: {
readData: function () {
// Ici on pourrait lire un stockage local si besoin
console.log('cityList:', JSON.stringify(this.cityList));
},
isCityExist: function (_cityName) {
if (!_cityName) return false;
return this.cityList.filter(item => item.name.trim().toUpperCase() === _cityName.trim().toUpperCase()).length > 0;
},


addCity: function (event) {
event.preventDefault();
const name = (this.formCityName || '').trim();
if (!name) {
this.messageForm = 'Veuillez saisir un nom de ville.';
return;
}
if (this.isCityExist(name)) {
this.messageForm = 'existe déjà';
this.formCityName = '';
return;
}
this.cityList.push({ name: name });
this.messageForm = '';
this.formCityName = '';
},
remove: function (_city) {
this.cityList = this.cityList.filter(item => item.name !== _city.name);
// Si la météo affichée correspondait à la ville supprimée, on la vide
if (this.cityWeather && this.cityWeather.name === _city.name) {
this.cityWeather = null;
}
},


meteo: function (_city) {
if (!_city || !_city.name) return;
this.cityWeatherLoading = true;
this.message = '';
const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(_city.name) + '&units=metric&lang=fr&appid=' + OPENWEATHER_API_KEY;
fetch(url)
.then(response => response.json())
.then(json => {
this.cityWeatherLoading = false;
if (json.cod === 200) {
this.cityWeather = json;
this.message = '';
} else {
this.cityWeather = null;
this.message = 'Météo introuvable pour ' + _city.name + ' (' + (json.message || json.cod) + ')';
}
})
.catch(err => {
this.cityWeatherLoading = false;
this.cityWeather = null;
this.message = 'Erreur réseau ou API.';
console.error(err);
});
},
formatTime: function (unixSec) {
if (!unixSec) return '';
return new Date(unixSec * 1000).toLocaleTimeString();
},


isDay: function () {
if (!this.cityWeather) return true;
const now = Math.floor(Date.now() / 1000);
return now >= this.cityWeather.sys.sunrise && now < this.cityWeather.sys.sunset;
},
addToListFromWeather: function () {
if (this.cityWeather && this.cityWeather.name) {
if (!this.isCityExist(this.cityWeather.name)) {
this.cityList.push({ name: this.cityWeather.name });
} else {
this.messageForm = 'La ville est déjà dans la liste.';
}
}
}
}
});
};