function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM(index) {
        const article = document.createElement( 'article' );
        // Lien
        const link = document.createElement('a');
        link.setAttribute('class', 'photographer-item');
        link.setAttribute('href', './photographer.html?id=' + id);
        link.setAttribute('tabindex', "0");
        //link.setAttribute('href', `./photographers.html`);
        // Image
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        link.appendChild(img);
        // Titre
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
       // link.appendChild(h2);
        // Span
        const span = document.createElement( 'span' );
        span.textContent = city + ', ' + country;
        // Ptag
        const pTag = document.createElement('p');
        pTag.textContent = tagline;
        // Pprice
        const pPrice = document.createElement('p');
        pPrice.textContent = price + '€/jour';

        pTag.classList.add('tagline');
        pPrice.classList.add('price');
        
        article.appendChild(link);
        //article.appendChild(link);
        article.appendChild(span);
        article.appendChild(pTag);
        article.appendChild(pPrice);
        return (article);
    }
    return { name, picture, city, country, tagline, price, getUserCardDOM }
}