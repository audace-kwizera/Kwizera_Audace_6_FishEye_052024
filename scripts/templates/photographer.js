function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        const h3 = document.createElement( 'h3' );
        h3.textContent = name;
        const span = document.createElement( 'span' );
        span.textContent = city + ', ' + country;
        const pTag = document.createElement('p');
        pTag.textContent = tagline;
        const pPrice = document.createElement('p');
        pPrice.textContent = price + '€/jour';

        pTag.classList.add('tagline');
        pPrice.classList.add('price');
        
        article.appendChild(img);
        article.appendChild(h3);
        article.appendChild(span);
        article.appendChild(pTag);
        article.appendChild(pPrice);
        return (article);
    }
    return { name, picture, city, country, tagline, price, getUserCardDOM }
}