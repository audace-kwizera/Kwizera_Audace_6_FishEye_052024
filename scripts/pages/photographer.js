//Mettre le code JavaScript lié à la page photographer.html
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');


async function init() {
    const { photographers, media } = await getPhotographers();

    console.log('photographers', photographers);

    const photographer = photographers.find(function(p) {
        console.log('p', p, 'id', id)
        return p.id === parseInt(id, 10)
    });
    console.log('photographer', photographer);
    const medias = media.filter(function(m) {
        return m.photographerId === parseInt(id, 10)
    });
    console.log('medias', medias)

    // lancer la page


    
   
}
init();