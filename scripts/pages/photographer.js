// Importation des classes MediaFactory, closeModal et displayModal depuis les chemins spécifiés
import { MediaFactory } from '../templates/mediaFactory.js';
import { closeModal, displayModal } from '../utils/contactForm.js';

// Initialisation de variables pour stocker le nom du photographe courant et l'indice du média courant
let currentPhotographerName = '';
let currentMediaIndex = 0;

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
    if (prevBtn) prevBtn.addEventListener('click', () => changeMedia(-1, mediaManager.photographerMedia));
    if (nextBtn) nextBtn.addEventListener('click', () => changeMedia(1, mediaManager.photographerMedia));


    // Ajout d'un gestionnaire d'événement pour les pressions de touches
    document.addEventListener('keydown', handleKeyPress);
});

// Fonction pour configurer la lightbox
function setupLightbox() {
    // Parcours de chaque média et ajout de gestionnaires d'événements
    mediaManager.photographerMedia.forEach((mediaItem) => {
        const item = document.querySelector(`[data-media-id="${mediaItem.id}"]`);
        createLightboxElements(); 
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

// Cette fonction crée les éléments de la lightbox une seule fois et les ajoute au DOM si nécessaire.
function createLightboxElements() {
    // Récupère la lightbox existante ou en crée une nouvelle si elle n'existe pas.
    const lightbox = document.getElementById('lightbox') || document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';

    // Création du conteneur principal pour le contenu de la lightbox.
    const contentDiv = document.createElement('div');
    contentDiv.className = 'lightbox-content';
    contentDiv.tabIndex = 0;

    // Boutons pour naviguer entre les médias (précédent).
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

    // Créer le bouton de fermeture de la lightbox.
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.tabIndex = 0;
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', closeLightbox);


    // Ajouter les éléments à la lightbox
    lightbox.appendChild(contentDiv);
    lightbox.appendChild(prevButton);
    lightbox.appendChild(nextButton);
    lightbox.appendChild(closeButton);

    // Ajouter la lightbox au body si elle n'y est pas déjà
    if (!document.getElementById('lightbox')) {
        document.body.appendChild(lightbox);
    }
}

// Ouvre la lightbox et affiche le contenu média sélectionné.
function openLightbox(media) {

    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    lightboxContent.innerHTML = media.getLightboxHTML(); // Nettoyer le contenu précédent




    const mediaObject = mediaManager.photographerMedia.find(m => m.id === media.id);

    if (mediaObject) {

        // Crée et ajoute un titre pour le média dans la lightbox.
        const titleElement = document.createElement('p');
        titleElement.textContent = mediaObject.title;
        titleElement.className = 'lightbox-title';
        titleElement.tabIndex = 0;
        lightboxContent.appendChild(titleElement);

        lightbox.style.display = 'block'; // Affiche la lightbox.
        lightbox.setAttribute('tabindex', '0'); // Permet le focus sur la lightbox.
        lightbox.focus(); // Met le focus sur la lightbox.
    } else {
        console.error('Média non trouvé pour l\'ID:', media);
    }
}



// Gère les pressions de touches pour naviguer dans la lightbox ou la fermer.
function handleKeyPress(event) {
    const lightbox = document.getElementById('lightbox');

    // Vérifie si la lightbox est ouverte avant de réagir aux touches.
    if (lightbox && lightbox.style.display === 'block') {
        if (event.key === 'ArrowLeft') {
            changeMedia(-1); // Média précédent.
        } else if (event.key === 'ArrowRight') {
            changeMedia(1); // Média suivant.
        } else if (event.key === 'Escape') {
            closeLightbox(); // Ferme la lightbox.
        }
    }
}

// Change le média affiché dans la lightbox en fonction du pas donné.
function changeMedia(step) {
    // Initialisation de l'indice du média actuel si nécessaire.
    if (currentMediaIndex === undefined) {
        currentMediaIndex = 0;
    }

    // Mise à jour de l'indice pour le nouveau média.
    currentMediaIndex += step;

    // Gérer le débordement de l'index
    if (currentMediaIndex >= mediaManager.photographerMedia.length) {
        currentMediaIndex = 0; // Retour au début si dépassement de la fin.
    } else if (currentMediaIndex < 0) {
        currentMediaIndex = mediaManager.photographerMedia.length - 1; // Aller à la fin si en dessous de zéro.
    }


    // Récupération du nouvel objet média et ouverture dans la lightbox.
    const newMediaId = mediaManager.photographerMedia[currentMediaIndex];
    openLightbox(newMediaId);
}

// Ferme la lightbox en modifiant son style d'affichage.
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.style.display === 'block') {
        lightbox.style.display = 'none'; // Cache la lightbox.
    }
}

// Ajout d'un gestionnaire d'événements pour fermer la lightbox avec la touche Échap
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});

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

    const nameH2 = document.createElement('h1');
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
    const breakLine = document.createElement('br');
    titreModal.textContent = "Contactez-moi ";
    titreModal.appendChild(breakLine);
    titreModal.appendChild(document.createTextNode(photographerData.name));

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

        const mediaElement = mediaItem.getHTML();
        mediaContainer.appendChild(mediaElement);

    });

    setupLightbox();
}

export function toggleLike(id, likesCountElement) {
    const media = mediaManager.photographerMedia.find(m => m.id === id);
    if (media) {
        media.isLiked = !media.isLiked;
        if (media.isLiked) {
            media.likes++;
        } else {
            media.likes--;
        }
        likesCountElement.textContent = media.likes;
        updateLikeDisplay(id, media.isLiked);
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
            mediaManager.photographerMedia.sort((b, a) => new Date(b.date) - new Date(a.date));
            break;
        case 'title':
            mediaManager.photographerMedia.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            mediaManager.photographerMedia.sort((a, b) => b.likes - a.likes);
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

