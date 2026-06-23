function showInfo(title,text){

document.getElementById("popupTitle")
.innerHTML=title;

document.getElementById("popupText")
.innerHTML=text;

document.getElementById("popup")
.style.display="flex";

}

function closePopup(){

document.getElementById("popup")
.style.display="none";

}