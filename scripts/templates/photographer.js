function photographerTemplate(data) {
    const { name, id, city, country, tagline, price } = data;

    const picture = `assets/images/Photographers/${id}.jpg`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'photographer-header';
        
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        article.appendChild(img);
        article.appendChild(h2);
        const pCity = document.createElement('p');
        pCity.textContent = `${city}, ${country}`;
        pCity.classList.add("country-style");
        const pTagline = document.createElement('p');
        pTagline.textContent = tagline;
        pTagline.classList.add("tagline-style");
        const pPrice = document.createElement('p');
        pPrice.textContent = `${price}€/jour`;
        pPrice.classList.add("price-style");

        const infoDiv = document.createElement('div');
        infoDiv.className = 'photographer-info';

        headerDiv.appendChild(img);
        headerDiv.appendChild(h2);
        article.appendChild(headerDiv);
        infoDiv.appendChild(pCity);
        infoDiv.appendChild(pTagline);
        infoDiv.appendChild(pPrice);
        article.appendChild(infoDiv);

        headerDiv.tabIndex = 0; // Permettre la navigation au clavier
        infoDiv.tabIndex = 0; 

        return (article);
    }
    return { name, picture, getUserCardDOM }
}