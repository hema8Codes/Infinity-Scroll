// Selectors
const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

// Global variables
let errorCounter = 0;
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photoArray = [];

let isInitialLoad = true; 

// API related variables
// Unsplash API
let initialCount = 20;
const apiKey = `YY-I31WnRC03frA8j3N3qCq_rS1IYlfDz-m1mg0jpcg`;
let apiURL = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}&query=painting`;


function updateAPIURLWithNewCount (picCount) {
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}&query=painting`;
  }
  

// Check if all images are loaded
function imageLoaded() {
    imagesLoaded++;
    if(imagesLoaded === totalImages){
        ready = true;
        loader.hidden = true;
    }
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes){
    for(const key in attributes){
        element.setAttribute(key, attributes[key]);
    }
}

// Create Elements For Links & Photos, Add to DOM, (Inserting photos into the DOM)
function displayPhotos(){
    imagesLoaded = 0;
    totalImages = photoArray.length;
    // Run function for each object in PhotosArray
    photoArray.forEach((photo) => {
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        setAttributes(item, {
            href: photo.links.html,
            target: '_blank',
        });
        // Create <img> for photo
        const img = document.createElement('img');
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });
        //Event Listener, check when each is finished loading
        img.addEventListener('load', imageLoaded);
        // Put <img> inside <a>, then put both inside imageContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });

}

//Get photos from Unsplash API
async function getPhotos(){
    try{
        const response = await fetch(apiURL);
        photoArray = await response.json();
        // console.log(photoArray);
        displayPhotos();
        if (isInitialLoad) { 
            updateAPIURLWithNewCount(30) 
            isInitialLoad = false 
          }   
    }catch(error){
        //Catch Error Here
        errorCounter < 0
        ? (getPhotos(), errorCounter++)
        : (console.log(error),
          (loader.hidden = true),
          (imageContainer.innerText = `Something is not working right, ${error}`));
    }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
    
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready){
        ready = false;
        getPhotos();

    }
})

// On Load
getPhotos();