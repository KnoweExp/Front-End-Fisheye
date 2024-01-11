import { disableTabIndexes, focusFirstElementInModal, enableTabIndexes } from '../pages/photographer.js';


export function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    disableTabIndexes();
    focusFirstElementInModal(modal);
}

document.addEventListener('DOMContentLoaded', () => {
    const closeModalButton = document.getElementById('closeModalButton');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', handleModaleKeypress);
});

function handleModaleKeypress(event) {
    const modal=document.getElementById("contact_modal");
    if (modal && modal.style.display === 'block' && event.key === 'Escape') {
        closeModal();
    }
}


export function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    enableTabIndexes()
}


document.querySelector("#contact_modal form").onsubmit = function (event) {
    event.preventDefault();
    if (!validateForm()) {
        return; // Empêche la soumission du formulaire si la validation échoue
    }
    // Continuez ici si tous les champs sont valides
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData.entries()));
};

function validateForm() {
    // Supprimer toutes les erreurs existantes
    const errors = document.querySelectorAll(".form-error");
    errors.forEach(error => error.remove());

    // Effacer les marques d'erreur des champs
    const errorFields = document.querySelectorAll(".has-error");
    errorFields.forEach(field => field.classList.remove("has-error"));

    let isValid = true;
    const form = document.querySelector("#contact_modal form");

    // Validation du prénom
    const firstName = form.querySelector("#first");
    if (!firstName.value.trim()) {
        displayError(firstName, "Veuillez entrer votre prénom");
        isValid = false;
    }

    const lastName = form.querySelector("#last");
    if (!lastName.value.trim()) {
        displayError(lastName, "Veuillez entrer votre prénom");
        isValid = false;
    }

    const email = form.querySelector("#email");
    if (!isValidEmail(email.value.trim())) {
        displayError(email, "Veuillez entrer une adresse e-mail valide");
        isValid = false;
    }


    const validText = form.querySelector("#message");
    if (!validText.value.trim()) {
        displayError(validText, "Veuillez entrer une adresse e-mail valide");
        isValid = false;
    }

    return isValid;
}

function displayError(element, message) {
    // Vérifier si un message d'erreur a déjà été affiché
    if (element.classList.contains("has-error")) {
        return;
    }

    // Créer et afficher le message d'erreur
    const errorDiv = document.createElement("div");
    errorDiv.textContent = message;
    errorDiv.classList.add("form-error");
    element.parentElement.appendChild(errorDiv);

    // Marquer le champ comme ayant une erreur
    element.classList.add("has-error");
}

function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}



