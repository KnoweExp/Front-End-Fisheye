import { buildMediaPath } from '../utils/utils.js';
import { toggleLike } from '../pages/photographer.js'

class ImageMedia {
    constructor(mediaData, currentPhotographerName, photographerMedia) {

        this.src = buildMediaPath(currentPhotographerName, mediaData);
        this.title = mediaData.title;
        this.id = mediaData.id;
        this.likes = mediaData.likes;
        this.photographerMedia = photographerMedia;
        this.type = 'image';
    }

    getHTML() {
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
        

        const likeButton = document.createElement('div');
        likeButton.id = `like-button-${this.id}`;
        likeButton.tabIndex = 0;
        likeButton.className = `reverse_heart_count`;
        likeButton.innerHTML = '<i class="far fa-heart"></i>';
        likeButton.addEventListener('click', () => toggleLike(this.id, likesCount, this.photographerMedia));
        likeButton.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                event.preventDefault();
                toggleLike(this.id, likesCount, this.photographerMedia);
            }
        });
        likeButton.appendChild(likesCount);
        mediaDetail.appendChild(likeButton);

        article.appendChild(mediaDetail);

        return article;
    }

    getLightboxHTML() {
        return `<img class="lightbox-content" tabindex="0" src="${this.src}" alt="${this.title}">`;
    }
}

class VideoMedia {
    constructor(mediaData, currentPhotographerName, photographerMedia) {
        this.src = buildMediaPath(currentPhotographerName, mediaData);
        this.title = mediaData.title;
        this.id = mediaData.id;
        this.likes = mediaData.likes;
        this.photographerMedia = photographerMedia;
        this.type = 'video';
    }

    getHTML() {

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

        
        const sourceElement = document.createElement('source');
        sourceElement.src = this.src;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);

        const mediaDetail = document.createElement('div');
        mediaDetail.className = "media-detail";

        const title = document.createElement('p');
        title.textContent = this.title;
        title.tabIndex = 0;
        mediaDetail.appendChild(title);

        const likesCount = document.createElement('span');
        likesCount.textContent = this.likes;
        likesCount.className = "likes-count";
        

        const likeButton = document.createElement('div');
        likeButton.id = `like-button-${this.id}`;
        likeButton.tabIndex = 0;
        likeButton.className = `reverse_heart_count`;
        likeButton.innerHTML = '<i class="far fa-heart"></i>';
        likeButton.addEventListener('click', () => toggleLike(this.id, likesCount, this.photographerMedia));
        likeButton.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                event.preventDefault();
                toggleLike(this.id, likesCount, this.photographerMedia);
            }
        });
        likeButton.appendChild(likesCount);
        mediaDetail.appendChild(likeButton);

        article.appendChild(mediaDetail);

        videoElement.innerHTML = "Votre navigateur ne supporte pas l'élément vidéo.";


        return article;
    }

    getLightboxHTML() {
        return `<video controls>
                    <source src="${this.src}" class="video-size" type="video/mp4">
                    Votre navigateur ne supporte pas l'élément vidéo.
                </video>`;
    }
}

function MediaFactory(mediaData, photographerName, photographerMedia) {

    if (mediaData.image) {
        return new ImageMedia(mediaData, photographerName, photographerMedia);
    } else if (mediaData.video) {
        return new VideoMedia(mediaData, photographerName, photographerMedia);


    } else {
        throw new Error('Type de média inconnu');
    }
}


export { MediaFactory };