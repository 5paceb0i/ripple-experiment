const list1 = document.querySelector(".notes-unordered__list1");
const list2 = document.querySelector(".notes-unordered__list2");
const colorArray = ["#26FFB1", "#9226FF", "#F535EE", "#26B1FF", "#FF574D"];
const svg1 = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect ';
const svg2 = 'x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#1D1D1D" stroke=';
const svg3 = '/></svg>';
const quotesArray = ["All these moments will be lost in time like tears in rain ....","If you are just a dream, I wish I would never wake up ...."];
let randomQuote = Math.floor(Math.random()*10);
const quoteSelector = document.querySelector(".quote");

const combinedNotesArray = allNotes.map((element,i) => {
    return `<li> ${svg1} class= ${element} ${svg2} ${colorArray[i%5]} ${svg3} <span> ${element} </span> </li>`;
});

const firstTenNotes = [];
const nextTenNotes = [];

for(let i=0; i < combinedNotesArray.length ; i++){
    if(i<10){
        firstTenNotes.push(combinedNotesArray[i]);
    }
    else{
        nextTenNotes.push(combinedNotesArray[i]);
    }
    
}

const combinedNoteString1  = firstTenNotes.join("");
const combinedNoteString2  = nextTenNotes.join("");

list1.innerHTML = combinedNoteString1;
list2.innerHTML = combinedNoteString2;

function displayMain(){
    const welcome = document.querySelector(".welcome__wrapper");
    const mainPage = document.querySelector("main");
    const aboutButton = document.querySelector(".about");

    welcome.setAttribute("style", "display:none");
    mainPage.setAttribute("style", "display:flex; height: calc(100vh - 7rem);");
    aboutButton.setAttribute("style", "");
    startMusic();
}

function displayAbout(){
    const about = document.querySelector("about");
    const aboutButton = document.querySelector(".about");
    const welcome = document.querySelector(".welcome__wrapper");
    const mainPage = document.querySelector("main");
    const close = document.querySelector(".close");

    about.setAttribute("style", "");
    close.setAttribute("style", "");
    aboutButton.setAttribute("style", "display:none;");
    mainPage.setAttribute("style", "display:none;");
    welcome.setAttribute("style", "display:none");
}

function displayMainFromClose(){
    const about = document.querySelector("about");
    const aboutButton = document.querySelector(".about");
    const welcome = document.querySelector(".welcome__wrapper");
    const mainPage = document.querySelector("main");
    const close = document.querySelector(".close");

    aboutButton.setAttribute("style", "");
    mainPage.setAttribute("style", "");
    close.setAttribute("style", "display:none;");
    about.setAttribute("style", "display:none;");
}


if(randomQuote>5){
    quoteSelector.innerHTML = quotesArray[1];
}
else{
    quoteSelector.innerHTML = quotesArray[0];
}
