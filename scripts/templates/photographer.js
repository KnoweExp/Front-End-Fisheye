function photographerTemplate(data) {
    const { name, id, city, country, tagline, price } = data;

    const picture = `assets/images/Photographers/${id}.jpg`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        
        
        
        const headerLink = document.createElement('a');
        headerLink.href = `photographer.html?id=${id}`;
        headerLink.setAttribute('aria-label', `Voir le profil de ${name}`)
        headerLink.className = 'photographer-header';
        
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", `Portrait de ${name}`);

        const h2 = document.createElement( 'h2' );
        h2.textContent = name;

        headerLink.appendChild(img);    // Ajout de l'image au headerDiv
        headerLink.appendChild(h2);     // Ajout du titre au headerDiv

        const infoDiv = document.createElement('div');
        infoDiv.className = 'photographer-info';

        const pCity = document.createElement('p');
        pCity.textContent = `${city}, ${country}`;
        pCity.classList.add("country-style");

        const pTagline = document.createElement('p');
        pTagline.textContent = tagline;
        pTagline.classList.add("tagline-style");

        const pPrice = document.createElement('p');
        pPrice.textContent = `${price}€/jour`;
        pPrice.classList.add("price-style");
        
        
        infoDiv.appendChild(pTagline);
        infoDiv.appendChild(pPrice);
        infoDiv.appendChild(pCity);
        
        
        // Ajouter le lien à l'article
        article.appendChild(headerLink);
        article.appendChild(infoDiv);

        headerLink.tabIndex = 0; // Permettre la navigation au clavier
        infoDiv.tabIndex = 0; 

        // ... le reste du code du template ...

// Ajouter un écouteur d'événements pour le clic
headerLink.addEventListener('click', (e) => {
    // Prévenir le comportement par défaut si vous voulez d'abord logger avant de rediriger
    e.preventDefault(); 

    console.log(`Photographe ID: ${id}`);
    // Logique pour récupérer les données du photographe si nécessaire

    // Puis rediriger vers la page de détails du photographe
    window.location.href = headerLink.href;
});


        return (article);
    }
    return { name, picture, getUserCardDOM }
}