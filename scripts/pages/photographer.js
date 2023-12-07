import { MediaFactory } from '../templates/mediaFactory.js';
import { buildMediaPath } from '../utils/utils.js';
let mediaArray = [];
let currentPhotographerName = '';
let currentMediaIndex = 0;
let globalPhotographerMedia = [];


//Mettre le code JavaScript lié à la page photographer.html
// Fonction pour afficher les détails du photographe dans le DOM
async function loadAndDisplayPhotographerData(photographerId) {
    try {
        const response = await fetch('./data/photographers.json');
        const data = await response.json();

        const photographerData = data.photographers.find(p => p.id === parseInt(photographerId, 10));
        const photographerMedia = data.media.filter(m => m.photographerId === parseInt(photographerId, 10));
        globalPhotographerMedia = photographerMedia;

        if (photographerData) {
            currentPhotographerName = photographerData.name;
            displayPhotographerDetails(photographerData, photographerMedia);
            displayPhotographerMedia(photographerMedia, photographerData.name);
        } else {
            console.error('Photographe non trouvé pour l\'ID:', photographerId);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

function setupLightbox() {
    document.querySelectorAll('.media-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const mediaId = item.dataset.mediaId;
            openLightbox(mediaId);
        });
    });
}

function openLightbox(mediaId) {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const media = mediaArray.find(m => m.id.toString() === mediaId);

    if (media) {
        const mediaPath = buildMediaPath(currentPhotographerName, media);
        console.log("Chemin construit:", mediaPath);

        if (media.image) {
            lightboxContent.innerHTML = `<img src="${mediaPath}" alt="${media.title}">`;
        } else if (media.video) {
            lightboxContent.innerHTML = `<video controls><source src="${mediaPath}" type="video/mp4"></video>`;
        }

        lightbox.style.display = 'block';
    } else {
        console.error('Média non trouvé pour l\'ID:', mediaId);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => changeMedia(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMedia(1));
});

function changeMedia(step) {
    currentMediaIndex += step;

    if (currentMediaIndex >= mediaArray.length) {
        currentMediaIndex = 0;
    } else if (currentMediaIndex < 0) {
        currentMediaIndex = mediaArray.length - 1;
    }

    const newMediaId = mediaArray[currentMediaIndex].id;
    openLightbox(newMediaId.toString());
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

window.onload = () => {
    setTimeout(setupLightbox, 1000); // Retarder pour tester
};

 function displayPhotographerDetails(photographerData, photographerMedia) {

    let totalLikes = 0;
    photographerMedia.forEach(media => {
        totalLikes += media.likes;
    });
    
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
    
    //encart photographe prix
    // Sélectionner l'élément 'aside' avec la classe 'encartPhotographe'
    const encartPhotographe = document.querySelector('.encartPhotographe');
    const encartNumberLike = document.querySelector('.number-like');
    if (encartNumberLike) {
        encartNumberLike.textContent = totalLikes + ' likes';
    }
    const priceEncart = document.createElement('p')
    priceEncart.textContent = `Prix : ${photographerData.price}€` 
    encartPhotographe.appendChild(priceEncart)

                
}

// Fonction pour afficher les médias du photographe
function displayPhotographerMedia(photographerMedia, photographerFullName){
    const mediaContainer = document.querySelector('.gallery-section');

    
    photographerMedia.forEach(mediaItem => {
        mediaItem.isLiked = false;
        
        mediaArray.push(mediaItem); // Stocker les données des médias dans le tableau global
        const mediaObject = MediaFactory(mediaItem, photographerFullName);
        const mediaElement = mediaObject.getHTML();
        mediaContainer.appendChild(mediaElement);

    });

    setupLightbox();
}

export function toggleLike(mediaId, likesCountElement, photographerMedia) {
    console.log('PhotographerMedia in toggleLike:', photographerMedia);
    const media = mediaArray.find(m => m.id === mediaId);
    if (media) {
        media.isLiked = !media.isLiked;
        if (media.isLiked) {
            media.likes++;
        } else {
            media.likes--;
        }
        likesCountElement.textContent = media.likes;
        updateLikeDisplay(mediaId, media.isLiked);
        console.log(media.isLiked)
        updateTotalLikes(photographerMedia); // Mettez à jour le total des likes dans l'encart
        
    }
}

function updateTotalLikes() {
    let totalLikes = 0;
    globalPhotographerMedia.forEach(media => {
        totalLikes += media.likes;
    });
    const encartNumberLike = document.querySelector('.number-like');
    if (encartNumberLike) {
        encartNumberLike.textContent = totalLikes + ' likes';
    }
}

function updateLikeDisplay(mediaId, isLiked) {
    const likeIcon = document.querySelector(`#like-button-${mediaId} i`);
    if (likeIcon) {
        likeIcon.className = isLiked ? "fas fa-heart" : "far fa-heart"; // Changez la classe de l'icône
    }
}


// Code pour récupérer l'ID du photographe de l'URL et afficher les détails
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');
if (photographerId) {
    loadAndDisplayPhotographerData(photographerId);
} else {
    console.error('Aucun ID de photographe fourni dans l\'URL');
}

