    async function getPhotographers() {
        // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet, 
        // function pour recuperer les informations des photographes du json.
        const response = await fetch('./data/photographers.json');
        const data = await response.json();
        // et bien retourner le tableau photographers seulement une fois récupéré
        return data;
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const data = await getPhotographers();
        displayData(data.photographers);
    }
    
    init();
    
