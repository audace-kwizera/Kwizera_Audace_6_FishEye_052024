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
// array of medias liked populate with media.id
const liked = [];

// Classe pour créer des vidéos
class VideoElement {
  constructor(src, alt, attributes = {}) {
    this.src = src;
    this.alt = alt;
    this.attributes = attributes;
    // Ajout de la source du poster
    this.posterSrc = this.posterSrc;
  }

  createElement() {
    const video = document.createElement("video");
    video.src = this.src;
    video.setAttribute("alt", this.alt);
    for (const [key, value] of Object.entries(this.attributes)) {
      video.setAttribute(key, value);
    }
    if (this.posterSrc) {
      video.setAttribute("poster", this.posterSrc); 
    }
    // Définir l'image de couverture
    // Ajout de controls pour les videos
    video.controls = true;
    video.autoplay = false;
    video.muted = false;
    // Ajouter un tabindex pour rendre l'élément focusable
    video.tabIndex = 0;
    // Assurer que la vidéo prend toute la largeur de la carte
    video.style.width = '100%';
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
      return new VideoElement(`./assets/medias/${media.video}`, media.title, {
        class: "media-video",
      }).createElement();
    } else {
      throw new Error("Format inconnu");
    }
  }
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
let medias = [];

let slideIndex = 0;

let isModalOpen = false;

async function init() {
  const { photographers, media } = await getPhotographers();

  const photographer = photographers.find(function (p) {
    return p.id === parseInt(id, 10);
  });
  console.log("photographer", photographer);
  const priceDom = document.getElementById("price-per-day");
  priceDom.textContent = photographer.price.toString();
  medias = media.filter(function (m) {
    return m.photographerId === parseInt(id, 10);
  });
  console.log("medias", medias);

  // lancer la page

  display(photographer);
  displayMedias(medias);
  setEventsListener();
}

// Mise à jour du total des likes après l'initialisation
updateTotalLikes();

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

function displayMedias(medias) {
  const mediaContainer = document.getElementById("mediaContainer");
  mediaContainer.innerHTML = "";

  medias.forEach((media, index) => {
    // Creation des Medias à l'aide de Media Factory
    const mediaElement = MediaFactory.createMedia(media);
    const mediaHtml = document.createElement("div");
    mediaHtml.className = "media";
    const aElement = document.createElement("a");
    //aElement.setAttribute("href", "#");
    aElement.setAttribute("tabindex", "0");
    aElement.appendChild(mediaElement);
    mediaHtml.appendChild(aElement);

    // Ajout de l'événement click pour le carousel
    aElement.addEventListener("click", (e) => {
      e.preventDefault();
      openCarousel(index); // Ouvrir le carrousel avec l'index approprié
    });

    // Ajout de l'événement keydown pour la touche "Entrée"
    aElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        openCarousel(index);
      }
    });

    aElement.appendChild(mediaElement);
    mediaHtml.appendChild(aElement);

    const mediaInfoHtml = `
            <div class="media-info-container">
              <div class="media-info">${media.title}</div>
              <form class="like-container" id="${media.id}">
                <label class="media-likes" for="input-likes-${index}" id="label-likes-${index}">${media.likes}</label>
                <input class="like-button" data-index="${index}" type="image" src="./assets/icons/like-red.png" id="input-likes-${index}" alt="like" />
              </form>
            </div>
        `;

    /*   <div class="media-price">${media.price} €</div> */
    mediaHtml.insertAdjacentHTML("beforeend", mediaInfoHtml);
    mediaContainer.appendChild(mediaHtml);
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
                <div class="media-info"></div>
                <div class="media-likes"></div>
                <div class="media-price"></div>
            </div>
        `;
    mediaHtml.insertAdjacentHTML("beforeend", mediaDescriptionHtml);
    carouselContainer.appendChild(mediaHtml);
  });

  // Mise à jour du total des likes
  updateTotalLikes();
}

// Gestion de la navigation au clavier
function handleKeyDown(event) {
  const mediaElements = document.querySelectorAll("#mediaContainer .media a");
  const mediaCount = mediaElements.length;

  // Verification Présence a des médias
  if (mediaCount === 0) return;

  if (event.key === "ArrowRight") {
    event.preventDefault();
    // Trouver l'index de l'élément actif
    const activeIndex = Array.from(mediaElements).findIndex(
      (el) => el === document.activeElement
    );
    // Element suivant
    const nextIndex = (activeIndex + 1) % mediaCount;
    mediaElements[nextIndex].focus();
  } else if (event.key === "ArrowLeft") {
    event.preventDefault();
    // Trouver l'index de l'élément actif
    const activeIndex = Array.from(mediaElements).findIndex(
      (el) => el === document.activeElement
    );
    // Element precedent
    const prevIndex = (activeIndex - 1 + mediaCount) % mediaCount;
    mediaElements[prevIndex].focus();
  }

  // Si modal est ouverture fermeture via echap
  if (isModalOpen && event.key === "Escape") {
    closeModal();
  }
}

function handleLikeClick(e, index) {
  e.preventDefault();
  // debug ouverture carousel
  e.stopPropagation();

  const myForm = e.target;
  const id = myForm.id;

  // nombre de likes
  if (liked.includes(id)) {
    medias[index].likes--;
    const i = liked.findIndex((el) => el === id);
    liked.splice(i, 1);
  } else {
    medias[index].likes++;
    liked.push(id);
  }

  // Mise à jour des likes
  const likesElement = document.getElementById(`label-likes-${index}`);
  likesElement.textContent = `${medias[index].likes}`;

  // Afficher le nombre de likes dans la console
  console.log(`Nombre de likes pour le média ${index}: ${medias[index].likes}`);

  // Mise à jour du total des likes après chaque interaction
  updateTotalLikes();
}

function showSlides() {
  const slides = document.querySelectorAll(".carousel .media");
  if (slides.length === 0) return;

  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${-slideIndex * 100}%)`;

    // Lecture des vidéos dans le carousel
    const video = slide.querySelector("video");
    if (video) {
      if (index === slideIndex) {
        video.play();
      } else {
        video.pause();
        // Remettre à zéro le temps de la vidéo
        video.currentTime = 0;
      }
    }
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

// Fonction pour gérer les événements de touche
function handleKeydown(e) {
  switch (e.key) {
    case "ArrowLeft":
      prevSlide();
      break;
    case "ArrowRight":
      nextSlide();
      break;
    case "Escape":
      closeCarousel();
      break;
  }
}

function openCarousel(index) {
  slideIndex = index;
  document.getElementById("carouselContainer").style.display = "flex";
  showSlides();

  // Ajouter les écouteurs d'événements au clavier lors de l'ouverture du carousel
  document.addEventListener("keydown", handleKeydown);
}

function closeCarousel() {
  document.getElementById("carouselContainer").style.display = "none";

  // Retirer les écouteurs d'événements au clavier lors de la fermeture du carousel
  document.removeEventListener("keydown", handleKeydown);
}

// Calcul et affichage du total des likes
function updateTotalLikes() {
  const totalLikes = medias.reduce((sum, media) => sum + media.likes, 0);
  document.getElementById("total-likes").textContent = totalLikes;
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
  isModalOpen = true;
}

function handleCloseModalClick(e) {
  e.preventDefault();
  closeModal();
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  isModalOpen = false;
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

    media.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        // Ouvrir le carrousel avec l'index approprié lorsque "Entrée" est pressée
        openCarousel(index);
      }
    });
  });
  const formLikes = document.querySelectorAll("form.like-container");
  Array.from(formLikes).forEach((form, index) => {
    form.addEventListener("submit", (e) => {
      handleLikeClick(e, index);
    });
  });
  const formContact = document.getElementById("contact-form");
  formContact.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(formContact);
    // Affichage des datas via le nom
    console.log("Prénom", formData.get("firstName"));
    console.log("Nom", formData.get("lastName"));
    console.log("Email", formData.get("email"));
    console.log("Message", formData.get("message"));
    closeModal();
  });

  // Evénements pour la navigation au clavier
  document.addEventListener("keydown", handleKeyDown);

  // Evenement pour la lecture des vidéos dans le carrousel au clavier
  const carouselMedias = document.querySelectorAll(".carousel .media");
  Array.from(carouselMedias).forEach((media) => {
    media.addEventListener("keydown", (e) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        media.querySelector("video")
      ) {
        const video = media.querySelector("video");
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    });
  });
}

init();
