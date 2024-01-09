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
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData.entries()));
};
