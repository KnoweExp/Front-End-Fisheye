import { MediaFactory } from '../templates/mediaFactory.js';
//Mettre le code JavaScript lié à la page photographer.html
// Fonction pour afficher les détails du photographe dans le DOM
async function loadAndDisplayPhotographerData(photographerId) {
    try {
        const response = await fetch('./data/photographers.json');
        const data = await response.json();

        const photographerData = data.photographers.find(p => p.id === parseInt(photographerId, 10));
        const photographerMedia = data.media.filter(m => m.photographerId === parseInt(photographerId, 10));

        if (photographerData) {
            displayPhotographerDetails(photographerData);
            displayPhotographerMedia(photographerMedia, photographerData.name);
        } else {
            console.error('Photographe non trouvé pour l\'ID:', photographerId);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

 function displayPhotographerDetails(photographerData) {
    
     // Sélectionner la div
     const headerDiv = document.querySelector('.photographer-section-item');
     if (!headerDiv) {
         console.error('La div .photograph-header est introuvable dans le DOM');
         return;
     }
            // Créer la div du profil
    const profileDiv = document.createElement('div');
    profileDiv.className = 'photographer-section__profile';

    const nameH2 = document.createElement('h2');
    nameH2.className = 'photographer-section__profile-name';
    nameH2.tabIndex = 0;
    nameH2.textContent = photographerData.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'photographer-section__profile-details';
    detailsDiv.tabIndex = 0;

    const locationSpan = document.createElement('span');
    locationSpan.className = 'photographer-section__profile-details-location';
    locationSpan.textContent = `${photographerData.city}, ${photographerData.country}`;

    const taglineSpan = document.createElement('span');
    taglineSpan.className = 'photographer-section__profile-details-tagline';
    taglineSpan.textContent = photographerData.tagline;

    // Assembler le profil
    detailsDiv.appendChild(locationSpan);
    detailsDiv.appendChild(taglineSpan);
    profileDiv.appendChild(nameH2);
    profileDiv.appendChild(detailsDiv);

    // Créer et ajouter le bouton
    const contactButton = document.createElement('button');
    contactButton.className = 'contact_button';
    contactButton.textContent = 'Contactez-moi';
    contactButton.onclick = displayModal; // Assurez-vous que displayModal est défini

    // Créer et ajouter l'image
    const img = document.createElement('img');
    img.className = 'photographer-section__picture';
    img.src = `assets/images/Photographers/${photographerData.id}.jpg`;
    img.alt = photographerData.name;


    // Ajouter les éléments à la div parente
    headerDiv.appendChild(profileDiv);
    headerDiv.appendChild(img);
    headerDiv.appendChild(contactButton);      
                
}

// Fonction pour afficher les médias du photographe
function displayPhotographerMedia(photographerMedia, photographerFullName){
    const mediaContainer = document.querySelector('.media-container');
    
    photographerMedia.forEach(mediaItem => {
        const mediaObject = MediaFactory(mediaItem, photographerFullName);
        const mediaElement = mediaObject.getHTML();
        mediaContainer.appendChild(mediaElement);
    });
}

// Code pour récupérer l'ID du photographe de l'URL et afficher les détails
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');
if (photographerId) {
    loadAndDisplayPhotographerData(photographerId);
} else {
    console.error('Aucun ID de photographe fourni dans l\'URL');
}

