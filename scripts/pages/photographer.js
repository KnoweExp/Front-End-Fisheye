// Importation des classes MediaFactory, closeModal et displayModal depuis les chemins spécifiés
import { MediaFactory } from '../templates/mediaFactory.js';
import { closeModal, displayModal } from '../utils/contactForm.js';

// Initialisation de variables pour stocker le nom du photographe courant et l'indice du média courant
let currentPhotographerName = '';
let currentMediaIndex = 0;
let openLightboxCallCount = 0;

// Définition de la classe MediaManager pour gérer les médias des photographes
class MediaManager {
    constructor() {
        this._photographerMedia = []; // Initialise un tableau vide pour stocker les médias
    }

    // Getter pour récupérer les médias du photographe
    get photographerMedia() {
        return this._photographerMedia;
    }

    // Setter pour définir les médias du photographe
    set photographerMedia(mediaArray) {
        this._photographerMedia = mediaArray;
    }

    // Méthode pour ajouter un média au tableau des médias du photographe
    addMedia(mediaItem) {
        this._photographerMedia.push(mediaItem);
    }
}

// Création d'une instance de MediaManager
const mediaManager = new MediaManager();

// Fonction asynchrone pour charger et afficher les données du photographe
async function loadAndDisplayPhotographerData(photographerId) {
    try {
        // Requête asynchrone pour récupérer les données des photographes
        const response = await fetch('./data/photographers.json');
        const data = await response.json();

        // Recherche des données du photographe en fonction de l'ID
        const photographerData = data.photographers.find(p => p.id === parseInt(photographerId, 10));

        // Traitement des données si le photographe est trouvé
        if (photographerData) {
            currentPhotographerName = photographerData.name;
            // Filtrage des médias en fonction de l'ID du photographe
            let filteredMedia = data.media.filter(m => m.photographerId === parseInt(photographerId, 10));

            // Traitement de chaque média filtré
            filteredMedia.forEach(mediaItem => {
                try {
                    // Création d'un objet média et ajout au gestionnaire de médias
                    const mediaObject = MediaFactory(mediaItem, currentPhotographerName);
                    mediaManager.addMedia(mediaObject);
                } catch (error) {
                    console.error('Erreur dans MediaFactory:', error);
                }
            });

            // Appel de fonctions pour trier, afficher les détails du photographe et les médias
            sortMedia("popularity");
            displayPhotographerDetails(photographerData);
            displayPhotographerMedia(mediaManager.photographerMedia, photographerData.name);
        } else {
            console.error('Photographe non trouvé pour l\'ID:', photographerId);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Fonctions pour désactiver et activer les index de tabulation
export function disableTabIndexes() {
    // Sélection de tous les éléments focusables hors de la modale
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');

    // Désactivation de l'index de tabulation pour chaque élément focusable hors de la modale
    focusableElements.forEach(element => {
        if (!element.closest('.modal')) {
            element.setAttribute('tabindex', '-1');
        }
    });
}

export function enableTabIndexes() {
    // Sélection de tous les éléments avec un index de tabulation désactivé
    const focusableElements = document.querySelectorAll('[tabindex="-1"]');

    // Réactivation de l'index de tabulation pour ces éléments
    focusableElements.forEach(element => {
        element.removeAttribute('tabindex');
    });
}

export function focusFirstElementInModal(modal) {
    // Sélection de tous les éléments focusables dans la modale
    const focusableElements = modal.querySelectorAll('a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])');

    // Focus sur le premier élément focusable si disponible
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

// Gestionnaire d'événement pour initialiser la lightbox au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Sélection des boutons de fermeture, précédent et suivant
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const closeBtnContact = document.getElementById('#closeModalButton')

    // Ajout de gestionnaires d'événements pour les boutons
    if (closeBtnContact) closeBtnContact.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => changeMedia(-1, photographerMedia));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMedia(1, photographerMedia));


    // Ajout d'un gestionnaire d'événement pour les pressions de touches
    document.addEventListener('keydown', handleKeyPress);
});

// Fonction pour configurer la lightbox
function setupLightbox() {
    // Parcours de chaque média et ajout de gestionnaires d'événements
    mediaManager.photographerMedia.forEach((mediaItem) => {
        const item = document.querySelector(`[data-media-id="${mediaItem.id}"]`);

        // Gestionnaire de clic pour ouvrir la lightbox
        item.addEventListener('click', () => {
            openLightbox(mediaItem, currentPhotographerName);
        });

        // Gestionnaire de touche pour ouvrir la lightbox avec la touche espace
        item.addEventListener('keydown', (event) => {
            if (event.keyCode === 32) { // 32 est le code pour la touche espace
                event.preventDefault(); // Empêche le comportement par défaut de la touche espace (défilement de la page)
                openLightbox(mediaItem, currentPhotographerName);
            }
        });
    });
}

function createLightboxElements() {
    const lightbox = document.getElementById('lightbox') || document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.tabIndex = 0;

    // Créer le bouton précédent
    const prevButton = document.createElement('a');
    prevButton.className = 'prev';
    prevButton.tabIndex = 0;
    prevButton.innerHTML = '&#10094;';
    prevButton.addEventListener('click', () => changeMedia(-1));

    // Créer le bouton suivant
    const nextButton = document.createElement('a');
    nextButton.className = 'next';
    nextButton.tabIndex = 0;
    nextButton.innerHTML = '&#10095;';
    nextButton.addEventListener('click', () => changeMedia(1));

    // Créer le bouton de fermeture
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.tabIndex = 0;
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeLightbox);

    // Créer le conteneur de contenu
    const contentDiv = document.createElement('div');
    contentDiv.className = 'lightbox-content';

    // Ajouter les éléments à la lightbox
    lightbox.appendChild(prevButton);
    lightbox.appendChild(nextButton);
    lightbox.appendChild(closeButton);
    lightbox.appendChild(contentDiv);

    // Ajouter la lightbox au body si elle n'y est pas déjà
    if (!document.getElementById('lightbox')) {
        document.body.appendChild(lightbox);
    }
}


function openLightbox(media) {
    openLightboxCallCount++;
    console.log("openLightbox a été appelé", openLightboxCallCount, "fois");
    console.log("media dans openLightbox:", media);
    // Assurez-vous que les éléments de la lightbox sont créés
    createLightboxElements();

    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    lightboxContent.innerHTML = media.getLightboxHTML();; // Nettoyer le contenu précédent


    const mediaObject = mediaManager.photographerMedia.find(m => m.id === media.id);

    if (mediaObject) {
        let mediaElement;
        /* if (mediaObject.type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = mediaObject.src;
            mediaElement.alt = mediaObject.title;
        } else if (mediaObject.type === 'video') {
            mediaElement = document.createElement('video');
            const sourceElement = document.createElement('source');
            sourceElement.src = mediaObject.src;
            sourceElement.type = 'video/mp4';
            mediaElement.appendChild(sourceElement);
            mediaElement.controls = true;
        }

        if (mediaElement) {
            mediaElement.tabIndex = 0;
            lightboxContent.appendChild(mediaElement);
        } else {
            console.error('Type de média non supporté ou non défini');
            return;
        } */

        // Créer et ajouter le titre
        const titleElement = document.createElement('p');
        titleElement.textContent = mediaObject.title;
        titleElement.className = 'lightbox-title';
        titleElement.tabIndex = 0;
        lightboxContent.appendChild(titleElement);

        lightbox.style.display = 'block';
        lightbox.setAttribute('tabindex', '0');
        lightbox.focus();
    } else {
        console.error('Média non trouvé pour l\'ID:', media);
    }
}



// Fonction pour gérer les pressions de touches
function handleKeyPress(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') { // Vérifier si la lightbox est ouverte
        if (event.key === 'ArrowLeft') {
            changeMedia(-1, mediaManager.photographerMedia); // Flèche gauche pour le média précédent
        } else if (event.key === 'ArrowRight') {
            changeMedia(1, mediaManager.photographerMedia); // Flèche droite pour le média suivant
        } else if (event.key === 'Escape') {
            closeLightbox(); // Touche Échap pour fermer la lightbox
        }
    }
}

function changeMedia(step) {
    // Assurez-vous que currentMediaIndex est initialisé à un index valide
    if (currentMediaIndex === undefined) {
        currentMediaIndex = 0;
    }

    currentMediaIndex += step;

    // Gérer le débordement de l'index
    if (currentMediaIndex >= mediaManager.photographerMedia.length) {
        currentMediaIndex = 0;
    } else if (currentMediaIndex < 0) {
        currentMediaIndex = mediaManager.photographerMedia.length - 1;
    }



    const newMediaId = mediaManager.photographerMedia[currentMediaIndex];
    openLightbox(newMediaId);
}


function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        lightbox.style.display = 'none';
    }
}

// Ajout d'un gestionnaire d'événements pour fermer la lightbox avec la touche Échap
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

window.onload = () => {
    setTimeout(setupLightbox, 1000); // Retarder pour tester
};

function displayPhotographerDetails(photographerData) {

    let totalLikes = 0;
    mediaManager.photographerMedia.forEach(media => {
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
    contactButton.textContent = `Contactez-moi`;
    contactButton.onclick = displayModal; // Assurez-vous que displayModal est défini

    // Ajout du nom de photographe a la modale contactez-moi
    const titreModal = document.getElementById('modalTitle');
    titreModal.textContent = "Contactez-moi - " + photographerData.name;

    // Créer et ajouter l'image
    const img = document.createElement('img');
    img.className = 'photographer-section__picture';
    img.tabIndex = 0;
    img.src = `assets/images/Photographers/${photographerData.id}.jpg`;
    img.alt = photographerData.name;


    // Ajouter les éléments à la div parente
    headerDiv.appendChild(profileDiv);
    headerDiv.appendChild(contactButton);
    headerDiv.appendChild(img);

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
function displayPhotographerMedia() {
    const mediaContainer = document.querySelector('.gallery-section');

    mediaContainer.innerHTML = '';

    mediaManager.photographerMedia.forEach(mediaItem => {

        mediaItem.isLiked = false;
        /* const mediaObject = MediaFactory(mediaItem, photographerFullName, photographerMedia); */

        const mediaElement = mediaItem.getHTML();
        mediaContainer.appendChild(mediaElement);

    });

    setupLightbox();
}

export function toggleLike(medias, likesCountElement) {
    console.log("toggleLike called", medias, likesCountElement, mediaManager.photographerMedia);
    const media = mediaManager.photographerMedia.find(m => m.id === medias);
    if (media) {
        media.isLiked = !media.isLiked;
        if (media.isLiked) {
            media.likes++;
        } else {
            media.likes--;
        }
        likesCountElement.textContent = media.likes;
        updateLikeDisplay(medias, media.isLiked);
        console.log(media.isLiked)
        updateTotalLikes(mediaManager.photographerMedia);
    }
}

function updateTotalLikes() {

    let totalLikes = 0;
    mediaManager.photographerMedia.forEach(media => {
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

document.getElementById('sortOptions').addEventListener('change', function () {
    sortMedia(this.value);
    displayPhotographerMedia(mediaManager.photographerMedia, currentPhotographerName);
});


function sortMedia(sortBy) {
    switch (sortBy) {
        case 'popularity':
            mediaManager.photographerMedia.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            // Assurez-vous que chaque objet média a une propriété 'date' valide
            mediaManager.photographerMedia.sort((b, a) => new Date(b.date) - new Date(a.date));
            break;
        case 'title':
            mediaManager.photographerMedia.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            // Vous pourriez avoir un tri par défaut ici
            break;
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

