const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let medias = [];

let slideIndex = 0;

async function init() {
    const { photographers, media } = await getPhotographers();

    const photographer = photographers.find(function (p) {
        return p.id === parseInt(id, 10);
    });
    console.log("photographer", photographer);
    const medias = media.filter(function (m) {
        return m.photographerId === parseInt(id, 10);
    });
    console.log("medias", medias);

    // lancer la page

    display(photographer);
    displayMedias(medias);
}

function setPhotographerName(name) {
    const pn = document.getElementById("photographerName");
    pn.textContent = name;
}

function display(p) {
    // Création du html
    const html = `
        <div class="component__photographer__container photographer-container">
            <div class="photographer infos">
                <!-- Left Container -->
                <div class="component__left photographer__infos__left__container">
                    <div class="photographer__avatar"><img src="./assets/photographers/${p.portrait}"alt="avatar" /></div> 
                    <div class="photographer__infos">${p.name}</div>
                    <div class="photographer__city">${p.city}</div>
                    <div class="photographer__description">${p.tagline}</div>
                </div>
                <!-- Right Container -->
                <div class="component__right photographer__infos__right__container">
                    <div class="photographer__avatar"><img src="./assets/photographers/${p.portrait}"alt="avatar" /></div> 
                    <div class="photographer__infos">${p.name}</div>
                    <div class="photographer__city">${p.city}</div>
                    <div class="photographer__description">${p.tagline}</div>
                    <div class="photographer__description">${p.price} €/jour</div>
                </div>
            </div>
        </div>

        <div class="photograph-header">
            <!-- Infos -->
            <div class="photographer__infos__container">
              <div class="photographer__infos">${p.name}</div>
              <div class="photographer__city">${p.city}</div>
              <div class="photographer__description">${p.tagline}</div>
            </div>
            <!-- Button -->
            <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
            <!-- Avatar -->
            <div class="photographer__avatar"><img src="./assets/photographers/${p.portrait}" alt="avatar" /></div>
        </div>
    `;
    const main = document.getElementById("main");
    main.innerHTML = html;
}

function displayMedias(medias) {
    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = ""; 

    medias.forEach((media, index) => {
        const mediaHtml = `
          <div class="media" onclick="openCarousel(${index})">
            <img src="./assets/medias/${media.image || media.video}" alt="${media.title}">
            <div class="media-info">${media.title}</div>
            <div class="media-likes">${media.likes} likes</div>
            <div class="media-price">${media.price} €</div>
          </div>
        `;
        mediaContainer.insertAdjacentHTML("beforeend", mediaHtml);
    });

    const carouselContainer = document.getElementById("carousel");
    carouselContainer.innerHTML = ""; 

    medias.forEach((media) => {
        const mediaHtml = `
          <div class="media">
            <img src="./assets/medias/${media.image || media.video}" alt="${media.title}">
            <div class="media-desciption">
                <div class="media-info">${media.title}</div>
                <div class="media-likes">${media.likes} likes</div>
                <div class="media-price">${media.price} €</div>
            </div>
          </div>
        `;
        carouselContainer.insertAdjacentHTML("beforeend", mediaHtml);
    });
}

function showSlides() {
    const slides = document.querySelectorAll(".carousel .media");
    if (slides.length === 0) return;

    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${-slideIndex * 100}%)`;
    });
}


// Récupérer les photographes et les médias
async function getPhotographers() {
    const response = await fetch("./data/photographers.json");
    return await response.json();
}


init();
