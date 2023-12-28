
export function buildMediaPath(currentPhotographerName, mediaData) {
    console.log("Au début de buildMediaPath - photographerName :", currentPhotographerName);

    if (typeof currentPhotographerName !== 'string') {
        console.error('photographerName doit être une chaîne de caractères. Type actuel:', typeof currentPhotographerName, 'Valeur:', currentPhotographerName);
        return ''; // Retourner un chemin par défaut ou gérer l'erreur autrement
    }

    const photographerFirstName = currentPhotographerName.split(' ')[0];
    const dashlessName = photographerFirstName.replace('-', ' ');
    console.log("dashlessName :", dashlessName, "photographerFirstName", photographerFirstName, "currentPhotographerName", currentPhotographerName)
    if (mediaData.image) {
        return `assets/images/${dashlessName}/${mediaData.image}`;
    } else if (mediaData.video) {
        return `assets/images/${dashlessName}/${mediaData.video}`;
    }
}



