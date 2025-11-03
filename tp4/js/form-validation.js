
// form-validation.js

// Compte le nombre de caractères
function calcNbChar(id) {
  document.querySelector(`#${id} + span`).textContent =
    document.querySelector(`#${id}`).value.length;
}

// Gère le clic du bouton GPS
document.querySelector("#btnGPS").addEventListener("click", function () {
  getLocation();
});

// Gère le formulaire
document.querySelector("#contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const firstname = document.querySelector("#firstname").value;
  const date = document.querySelector("#birthdate").value;
  const adress = document.querySelector("#address").value;
  const mail = document.querySelector("#email").value;

  // Validation simple
  if (name.length < 5 || firstname.length < 5 || adress.length < 5) {
    alert("⚠️ Tous les champs doivent comporter au moins 5 caractères !");
    return;
  }

  contactStore.add(name, firstname, date, adress, mail);
  displayContactList();
  e.target.reset();
});

// Affiche la liste des contacts
function displayContactList() {
  const contactListString = localStorage.getItem("contactList");
  const contactList = contactListString ? JSON.parse(contactListString) : [];

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  for (const contact of contactList) {
    tbody.innerHTML += `
      <tr>
        <td>${contact.name}</td>
        <td>${contact.firstname}</td>
        <td>${contact.date}</td>
        <td>${contact.adress}</td>
        <td>${contact.mail}</td>
      </tr>`;
  }
}

// Réinitialise la liste
document.querySelector("#btnReset").addEventListener("click", function () {
  if (confirm("Supprimer tous les contacts ?")) {
    contactStore.reset();
    displayContactList();
  }
});

// Charger la liste au démarrage
window.onload = function () {
  displayContactList();
};
