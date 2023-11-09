function photographerTemplate(data) {
    const { name, id, city, country, tagline, price } = data;

    const picture = `assets/images/Photographers/${id}.jpg`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        article.appendChild(img);
        article.appendChild(h2);
        const pCity = document.createElement('p');
        pCity.textContent = `${city}, ${country}`;
        const pTagline = document.createElement('p');
        pTagline.textContent = tagline;
        const pPrice = document.createElement('p');
        pPrice.textContent = `${price}€/jour`;

        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(pCity);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return (article);
    }
    return { name, picture, getUserCardDOM }
}