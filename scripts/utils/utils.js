
export function buildMediaPath(photographerFullName, mediaData) {
    console.log(photographerFullName)
    const photographerFirstName = photographerFullName.split(' ')[0];
    const dashlessName = photographerFirstName.replace('-', ' ');

    if (mediaData.image) {
        return `assets/images/${dashlessName}/${mediaData.image}`;
    } else if (mediaData.video) {
        return `assets/images/${dashlessName}/${mediaData.video}`;
    }
    
}


