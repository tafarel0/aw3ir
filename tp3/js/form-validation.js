
window.onload = function () {
  console.log("DOM ready!");

  const form = document.querySelector("#myForm");
  const modal = new bootstrap.Modal(document.getElementById("myModal"));
  const modalTitle = document.querySelector(".modal-title");
  const modalBody = document.querySelector(".modal-body");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const nom = document.querySelector("#nom").value.trim();
    const prenom = document.querySelector("#prenom").value.trim();
    const birthday = document.querySelector("#birthday").value;
    const adresse = document.querySelector("#adresse").value.trim();
    const email = document.querySelector("#email").value.trim();

    // Validation de base
    if (
      nom.length < 5 ||
      prenom.length < 5 ||
      adresse.length < 5 ||
      !validateEmail(email) ||
      !validateBirthday(birthday)
    ) {
      modalTitle.textContent = "Erreur de saisie";
      modalBody.innerHTML = `
        <p>Veuillez vérifier les champs :</p>
        <ul>
          <li>Nom, prénom et adresse : minimum 5 caractères</li>
          <li>Email valide requis</li>
          <li>Date de naissance ne doit pas être dans le futur</li>
        </ul>`;
      modal.show();
      return;
    }

    // Si tout est OK
    // modalTitle.textContent = "Formulaire validé 🎉";
    // modalBody.innerHTML = `
    //   <p>Toutes les informations sont correctes.</p>
    //   <a href="http://maps.google.com/maps?q=Paris" target="_blank">
    //     <img src="https://maps.googleapis.com/maps/api/staticmap?markers=Paris&zoom=14&size=400x300&scale=2&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg" 
    //     alt="Google Maps Paris" class="img-fluid rounded">
    //   </a>

    modalTitle.textContent = `Bienvenue ${prenom} ${nom} 🎉`;

    // Encodage de l'adresse pour Google Maps
    const adresseEncodée = encodeURIComponent(adresse);
    const mapURL = `https://maps.googleapis.com/maps/api/staticmap?center=${adresseEncodée}&markers=${adresseEncodée}&zoom=14&size=400x300&scale=2&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg`;

    modalBody.innerHTML = `
      <p><strong>Bonjour ${prenom} ${nom}</strong>,</p>
      <p>Vous êtes né(e) le <strong>${birthday}</strong>.</p>
      <p>Votre adresse est : <strong>${adresse}</strong>.</p>
      <p>Adresse email : <strong>${email}</strong></p>
      <hr>
      <p>Voici la localisation de votre adresse sur Google Maps :</p>
      <a href="http://maps.google.com/maps?q=${adresseEncodée}" target="_blank">
        <img src="${mapURL}" alt="Google Maps - ${adresse}" class="img-fluid rounded shadow">
      </a>

      
    `;
    modal.show();
  });

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function validateBirthday(birthday) {
    if (!birthday) return false;
    const birthdayDate = new Date(birthday);
    const nowTimestamp = Date.now();
    return birthdayDate.getTime() < nowTimestamp;
  }
};
