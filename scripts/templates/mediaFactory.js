
class ImageMedia {
    constructor(mediaData, photographerFullName) {
        const photographerFirstName = photographerFullName.split(' ')[0];
        this.src = `assets/images/${photographerFirstName}/${mediaData.image}`;
        this.title = mediaData.title;
        // ... autres propriétés ...
    }
    
    getHTML() {
        const imgElement = document.createElement('img');
        imgElement.src = this.src;
        imgElement.alt = this.title;
        // ... autres attributs et styles ...
        return imgElement;
    }
}

class VideoMedia {
    constructor(mediaData, photographerFullName) {
        const photographerFirstName = photographerFullName.split(' ')[0];
        this.src = `assets/images/${photographerFirstName}/${mediaData.video}`;
        this.title = mediaData.title;
        // ... autres propriétés ...
    }
    
    getHTML() {
        const videoElement = document.createElement('video');
        videoElement.src = this.src;
        videoElement.title = this.title;
        // ... autres attributs et styles ...
        return videoElement;
    }
}

function MediaFactory(mediaData, photographerName) {
    if ('image' in mediaData) {
        return new ImageMedia(mediaData, photographerName);
    } else if ('video' in mediaData) {
        return new VideoMedia(mediaData, photographerName);
    } else {
        throw new Error('Type de média inconnu');
    }
}

export { MediaFactory };