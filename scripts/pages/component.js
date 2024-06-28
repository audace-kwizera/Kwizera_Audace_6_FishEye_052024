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
    setEventsListener();
    //displayMedias(medias);
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
                <!-- Middle Container -->
                <div class="component__middle photographer__infos__middle__container"></div>
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
            <button class="contact_button" id="openmodal_second">Contactez-moi</button>
            <!-- Avatar -->
            <div class="photographer__avatar"><img src="./assets/photographers/${p.portrait}" alt="avatar" /></div>
        </div>
    `;
    const main = document.getElementById("main");
    main.innerHTML = html;
}


// Récupérer les photographes et les médias
async function getPhotographers() {
    const response = await fetch("./data/photographers.json");
    return await response.json();
}

function setEventsListener() { 
    //Modal ouverture contact
    let openmodal = document.getElementById("openmodal");
    let openmodal_second = document.getElementById("openmodal_second");
    openmodal.addEventListener("click", () => {
        console.log('open');
      displayModal()
    });
    openmodal_second.addEventListener("click", () => {
        console.log('open');
        displayModal()
    })
  
    // Modal fermeture contact
    let closemodal = document.getElementById("closemodal")
    closemodal.addEventListener("click", () => {
        console.log('close');
        closeModal()
    })
  }


init();
