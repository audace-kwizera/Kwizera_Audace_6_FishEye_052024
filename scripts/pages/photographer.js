// Classe pour créer des images
class ImageElement {
  constructor(src, alt, attributes = {}) {
    this.src = src;
    this.alt = alt;
    this.attributes = attributes;
  }

  createElement() {
    const img = document.createElement("img");
    img.src = this.src;
    img.alt = this.alt;
    for (const [key, value] of Object.entries(this.attributes)) {
      img.setAttribute(key, value);
    }
    return img;
  }
}

// Classe pour créer des vidéos
class VideoElement {
  constructor(src, attributes = {}) {
    this.src = src;
    this.attributes = attributes;
  }

  createElement() {
    const video = document.createElement("video");
    video.src = this.src;
    for (const [key, value] of Object.entries(this.attributes)) {
      video.setAttribute(key, value);
    }
    // Ajout de controls pour les videos
    video.controls = true;
    video.autoplay = false;
    video.muted = false;
    return video;
  }
}

// Factory pour créer des éléments medias
class MediaFactory {
  static createMedia(media) {
    if (media.image) {
      return new ImageElement(`./assets/medias/${media.image}`, media.title, {
        class: "media-img",
      }).createElement();
    } else if (media.video) {
      return new VideoElement(`./assets/medias/${media.video}`, {
        class: "media-video"
      }).createElement();
    } else {
      throw new Error("Unknown media type");
    }
  }
}

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
  medias = media.filter(function (m) {
    return m.photographerId === parseInt(id, 10);
  });
  console.log("medias", medias);

  // lancer la page

  display(photographer);
  displayMedias(medias);
  setEventsListener();
}

function setPhotographerName(name) {
  const pn = document.getElementById("photographerName");
  pn.textContent = name;
}

function display(p) {
  // Création du html
  const html = `
        <div class="photograph-header">
            <!-- Infos -->
            <div class="photographer__infos__container">
              <div class="photographer__infos">${p.name}</div>
              <div class="photographer__city">${p.city}</div>
              <div class="photographer__description">${p.tagline}</div>
            </div>
            <!-- Button -->
            <button id="openmodal" class="contact_button">Contactez-moi</button>
            <!-- Avatar -->
            <div class="photographer__avatar"><img src="./assets/photographers/${p.portrait}" alt="avatar" /></div>
        </div>
    `;
  const main = document.getElementById("main");
  main.innerHTML = html;
}

function displayMedias(medias) {div
  const mediaContainer = document.getElementById("mediaContainer");
  mediaContainer.innerHTML = "";

  medias.forEach((media, index) => {
    // Creation des Medias à l'aide de Media Factory
    const mediaElement = MediaFactory.createMedia(media);
    const mediaHtml = document.createElement("div");
    mediaHtml.className = "media";
    const aElement = document.createElement('a');
    aElement.setAttribute('href','#')
    aElement.appendChild(mediaElement);
    mediaHtml.appendChild(aElement);
    mediaHtml.appendChild(mediaElement);

    const mediaInfoHtml = `
            <div class="media-info">${media.title}</div>
            <div class="like-container">
              <div class="like-button" data-index="${index}">Like</div>
              <div class="media-likes" id="likes-${index}">${media.likes} U+2665 </div>
            </div>
            
            <div class="media-price">${media.price} €</div>
        `;

    mediaHtml.insertAdjacentHTML("beforeend", mediaInfoHtml);
    // Ajout d'un gestionnaire d'événements pour ouvrir le carousel
    mediaHtml.addEventListener("click", (e) => handleClickMedias(e, index));
    mediaContainer.appendChild(mediaHtml);
    // Ajout du like button
    const likeButton = mediaHtml.querySelector(
      `.like-button[data-index="${index}"]`
    );
    likeButton.addEventListener("click", (e) => handleLikeClick(e, index));
  });

  const carouselContainer = document.getElementById("carousel");
  carouselContainer.innerHTML = "";

  medias.forEach((media, index) => {
    // Création d'éléments medias
    const mediaElement = MediaFactory.createMedia(media);
    const mediaHtml = document.createElement("div");
    mediaHtml.className = "media";
    mediaHtml.appendChild(mediaElement);

    const mediaDescriptionHtml = `
            <div class="media-desciption" >
                <div class="media-info">${media.title}</div>
                <div class="media-likes">${media.likes} U+2665</div>
                <div class="media-price">${media.price} €</div>
            </div>
        `;
    mediaHtml.insertAdjacentHTML("beforeend", mediaDescriptionHtml);
    carouselContainer.appendChild(mediaHtml);
  });
}

function handleLikeClick(e, index) {
  e.preventDefault();
  // debug ouverture carousel
  e.stopPropagation();

  // nombre de likes
  medias[index].likes++;

  // Mise à jour des likes
  const likesElement = document.getElementById(`likes-${index}`);
  likesElement.textContent = `${medias[index].likes} likes`;

  // Afficher le nombre de likes dans la console
  console.log(`Nombre de likes pour le média ${index}: ${medias[index].likes}`);
}

function showSlides() {
  const slides = document.querySelectorAll(".carousel .media");
  if (slides.length === 0) return;

  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${-slideIndex * 100}%)`;
  });
}

function nextSlide() {
  const slides = document.querySelectorAll(".carousel .media");
  slideIndex = (slideIndex + 1) % slides.length;
  showSlides();
}

function prevSlide() {
  const slides = document.querySelectorAll(".carousel .media");
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlides();
}

function openCarousel(index) {
  slideIndex = index;
  document.getElementById("carouselContainer").style.display = "flex";
  showSlides();
}

function closeCarousel() {
  document.getElementById("carouselContainer").style.display = "none";
}

// Récupérer les photographes et les médias
async function getPhotographers() {
  const response = await fetch("./data/photographers.json");
  return await response.json();
}

function handleSelectChange(e) {
  e.preventDefault();
  console.log("select", e.target.value);
  const sortOf = e.target.value;
  // 1. trier le tableau de médias
  if (sortOf === "title") {
    medias.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortOf === "date") {
    medias.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  } else if (sortOf === "likes") {
    medias.sort(function (a, b) {
      return b.likes - a.likes;
    });
  }
  console.log("result", medias);
  // 2. réafficher les médias en fonction de ce nouveau trie
  displayMedias(medias);
  setEventsListener();
}

//Modal ouverture contact
function handleOpenModalClick(e) {
  e.preventDefault();
  displayModal();
}

function handleCloseModalClick(e) {
  e.preventDefault();
  closeModal();
}

function handlePrevSlide(e) {
  e.preventDefault();
  prevSlide();
}

function handleNextSlide(e) {
  e.preventDefault();
  nextSlide();
}

function handleCloseSlide(e) {
  e.preventDefault();
  closeCarousel();
}

function handleClickMedias(e, index) {
  e.preventDefault();
  openCarousel(index);
}

function setEventsListener() {
  const selectId = "select__order__by";
  const selectElement = document.getElementById(selectId);
  selectElement.removeEventListener("change", handleSelectChange);
  selectElement.addEventListener("change", handleSelectChange);

  //Modal ouverture contact
  const openmodal = document.getElementById("openmodal");
  openmodal.removeEventListener("click", handleOpenModalClick);
  openmodal.addEventListener("click", handleOpenModalClick);

  // Modal fermeture contact
  const closemodal = document.getElementById("closemodal");

  closemodal.removeEventListener("click", handleCloseModalClick);
  closemodal.addEventListener("click", handleCloseModalClick);

  const btnPrevSlide = document.getElementById("btn-prev-slide");
  const btnNextSlide = document.getElementById("btn-next-slide");
  const btnCloseSlide = document.getElementById("btn-close-slide");

  btnPrevSlide.removeEventListener("click", handlePrevSlide);
  btnNextSlide.removeEventListener("click", handleNextSlide);
  btnCloseSlide.removeEventListener("click", handleCloseSlide);

  btnPrevSlide.addEventListener("click", handlePrevSlide);
  btnNextSlide.addEventListener("click", handleNextSlide);
  btnCloseSlide.addEventListener("click", handleCloseSlide);

  const medias = document.querySelectorAll("#mediaContainer .media a");
  Array.from(medias).forEach((media, index) => {
    media.removeEventListener("click", (e) => handleClickMedias(e, index));
    media.addEventListener("click", (e) => handleClickMedias(e, index));
  });
}

init();
