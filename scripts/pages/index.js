


/*  async function getPhotographers() {
        return await fetch = await fetch('./data/photographers.json', {
            headers: {
            'Accept': 'application/json',
        }});
        const response = await fetch('', {
            headers: {
                'Accept': 
            }
        
        }) */
// Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet,
// mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".

// et bien retourner le tableau photographers seulement une fois récupéré
/* return ({
            photographers: [...photographers]}) */

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
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
