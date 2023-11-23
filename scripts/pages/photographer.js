//Mettre le code JavaScript lié à la page photographer.html
// Fonction pour afficher les détails du photographe dans le DOM
async function displayPhotographerDetails(photographerId) {
    try {
        const response = await fetch('./data/photographers.json');
        const data = await response.json();

        // Trouver les données du photographe spécifique en utilisant l'ID
        const photographerData = data.photographers.find(p => p.id === parseInt(photographerId, 10));
        if (photographerData) {
            // Construire le contenu HTML du photographe
            const photographerContent = `
                <img src="assets/images/Photographers/${photographerData.id}.jpg" alt="${photographerData.name}">
                <h2>${photographerData.name}</h2>
                <p>${photographerData.city}, ${photographerData.country}</p>
                <p>${photographerData.tagline}</p>
                <p>${photographerData.price}€/jour</p>
            `;

            // Sélectionner la div 'photographer-header' et insérer le contenu HTML
            const headerDiv = document.querySelector('.photograph-header');
            if (headerDiv) {
                headerDiv.innerHTML = photographerContent;
            } else {
                console.error('La div .photograph-header est introuvable dans le DOM');
            }
        } else {
            console.error('Photographe non trouvé pour l\'ID:', photographerId);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données du photographe:', error);
    }
}

// Code pour récupérer l'ID du photographe de l'URL et afficher les détails
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');
if (photographerId) {
    displayPhotographerDetails(photographerId);
} else {
    console.error('Aucun ID de photographe fourni dans l\'URL');
}

