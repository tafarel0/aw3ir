const API_KEY = "98d269956f1d426d2b7e7b487fe3bba0";

const app = Vue.createApp({
    data() {
        return {
            city: "",
            cities: [],
            error: ""
        };
    },

    mounted() {
        this.getUserPosition();
    },

    methods: {

        async addCity() {
            this.error = "";

            if (!this.city.trim()) return;
            const name = this.city.trim();

            if (this.cities.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                this.error = "existe déjà";
                return;
            }

            try {
                const meteo = await this.fetchWeatherByCity(name);

                this.cities.push(meteo);

                // Initialiser la carte après affichage du DOM
                this.$nextTick(() => {
                    this.initMap(this.cities.length - 1, meteo.lat, meteo.lon);
                });

                this.city = "";

            } catch (e) {
                this.error = "Ville introuvable";
            }
        },

        removeCity(index) {
            this.cities.splice(index, 1);
        },

        async fetchWeatherByCity(cityName) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=fr`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Erreur API");

            const data = await response.json();
            return this.formatWeatherData(data);
        },

        async fetchWeatherByCoords(lat, lon) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`;

            const res = await fetch(url);
            const data = await res.json();
            return this.formatWeatherData(data);
        },

        formatWeatherData(data) {
            return {
                name: data.name,
                temp: Math.round(data.main.temp),
                description: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                clouds: data.clouds.all,
                humidity: data.main.humidity,
                wind: data.wind.speed,
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString("fr-FR"),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString("fr-FR"),
                lat: data.coord.lat,
                lon: data.coord.lon
            };
        },

        initMap(index, lat, lon) {
            const map = L.map("map-" + index).setView([lat, lon], 12);

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

            L.marker([lat, lon]).addTo(map);
        },

        // 📌 Géolocalisation de l'utilisateur
        getUserPosition() {
    if (!navigator.geolocation) {
        this.error = "La géolocalisation n'est pas supportée par votre navigateur.";
        return;
    }

    this.error = "Récupération de votre position...";

    navigator.geolocation.getCurrentPosition(
        async pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            try {
                const meteo = await this.fetchWeatherByCoords(lat, lon);

                // empêcher doublon si l'utilisateur est déjà dans la liste
                if (!this.cities.some(c => c.name === meteo.name)) {
                    this.cities.push(meteo);
                }

                this.error = "";

                this.$nextTick(() => {
                    this.initMap(this.cities.length - 1, meteo.lat, meteo.lon);
                });
            } catch (e) {
                this.error = "Impossible de récupérer la météo de votre position.";
            }
        },

        err => {
            if (err.code === 1) this.error = "Permission refusée 🚫";
            else this.error = "Impossible de récupérer votre position.";
        }
    );
}

    }
});

app.mount("#app");
