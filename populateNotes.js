const list1 = document.querySelector(".notes-unordered__list1");
const list2 = document.querySelector(".notes-unordered__list2");
const colorArray = ["#26FFB1", "#9226FF", "#F535EE", "#26B1FF", "#FF574D"];
const svg1 = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect ';
const svg2 = 'x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#1D1D1D" stroke=';
const svg3 = '/></svg>';


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

    welcome.setAttribute("style", "display:none");
    mainPage.setAttribute("style", "display:flex; height: calc(100vh - 7rem);");
    startMusic();
}