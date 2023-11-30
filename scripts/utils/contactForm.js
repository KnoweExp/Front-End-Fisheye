function displayModal() {
    const modal = document.getElementById("contact_modal");
	modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
}

document.querySelector("#contact_modal form").onsubmit = function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    console.log(Object.fromEntries(formData.entries()));
};
