
const getConfig = () => {
    return {
      headers: {
        Accept: "application/json",
      },
    };
  };

//import des datas
async function getPhotographers() {
    const response = await fetch("./data/photographers.json", getConfig());
    const data = await response.json();
    return { photographers: data.photographers, media: data.media };
  }
