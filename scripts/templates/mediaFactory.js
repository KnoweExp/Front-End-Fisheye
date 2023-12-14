import { buildMediaPath } from '../utils/utils.js';
import { toggleLike } from '../pages/photographer.js'

class ImageMedia {
    constructor(mediaData, photographerFullName, photographerMedia) {
        this.src = buildMediaPath(photographerFullName, mediaData);
        this.title = mediaData.title;
        this.id = mediaData.id;
        this.likes = mediaData.likes;
        this.photographerMedia = photographerMedia;
        // L'ID est pris du JSON
        // ... autres propriétés ...
    }
    
    getHTML(photographerMedia) {
        const article = document.createElement('article');
        article.className = "media-container";

        const imgElement = document.createElement('img');
        imgElement.tabIndex = 0;
        imgElement.src = this.src;
        imgElement.alt = this.title;
        imgElement.className = "media-item";
        imgElement.dataset.mediaId = this.id;
        article.appendChild(imgElement);

        const mediaDetail = document.createElement('div');
        mediaDetail.className = "media-detail";

        const title = document.createElement('p');
        title.textContent = this.title;
        title.tabIndex = 0;
        mediaDetail.appendChild(title);

        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.className = "likes-count";
        likesCount.tabIndex= 0;
        mediaDetail.appendChild(likesCount);

        const likeButton = document.createElement('div');
        likeButton.id = `like-button-${this.id}`;
        likeButton.innerHTML = '<i class="far fa-heart"></i>';
        likeButton.addEventListener('click', () => toggleLike(this.id, likesCount, this.photographerMedia));
        mediaDetail.appendChild(likeButton);

        article.appendChild(mediaDetail);

        return article;
    }
}

class VideoMedia {
    constructor(mediaData, photographerFullName, photographerMedia) {
        this.src = buildMediaPath(photographerFullName, mediaData);
        this.title = mediaData.title;
        this.id = mediaData.id; // L'ID est pris du JSON
        this.likes = mediaData.likes;
        this.photographerMedia = photographerMedia;
        // ... autres propriétés ...
    }
    
    getHTML(photographerMedia) {
        console.log("Likes for video", this.id, ":", this.likes);

        const article = document.createElement('article');
        article.className = "media-container";

        const videoElement = document.createElement('video');
        videoElement.tabIndex = 0;
        videoElement.controls = true;
        videoElement.src = this.src;
        videoElement.title = this.title;
        videoElement.className = "media-item";
        videoElement.dataset.mediaId = this.id;
        article.appendChild(videoElement)

        // Créer et ajouter l'élément <source>
        const sourceElement = document.createElement('source');
        sourceElement.src = this.src;
        sourceElement.type = 'video/mp4'; // Assurez-vous que le type correspond au format de votre vidéo
        videoElement.appendChild(sourceElement);

        const mediaDetail = document.createElement('div');
        mediaDetail.className = "media-detail";

        const title = document.createElement('p');
        title.textContent = this.title;
        title.tabIndex = 0;
        mediaDetail.appendChild(title);

        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.tabIndex= 0;
        likesCount.className = "likes-count";
        mediaDetail.appendChild(likesCount);

        const likeButton = document.createElement('div');
        likeButton.id = `like-button-${this.id}`;
        likeButton.innerHTML = '<i class="far fa-heart"></i>';
        likeButton.addEventListener('click', () => toggleLike(this.id, likesCount, this.photographerMedia));
        mediaDetail.appendChild(likeButton);

        article.appendChild(mediaDetail);

        // Ajouter un contenu de fallback
        videoElement.innerHTML = "Votre navigateur ne supporte pas l'élément vidéo.";

        // ... autres attributs et styles ...
        return article;
    }
}

function MediaFactory(mediaData, photographerName, photographerMedia) {
    if ('image' in mediaData) {
        return new ImageMedia(mediaData, photographerName, photographerMedia);
    } else if ('video' in mediaData) {
        return new VideoMedia(mediaData, photographerName, photographerMedia);
    } else {
        throw new Error('Type de média inconnu');
    }
}

export { MediaFactory };