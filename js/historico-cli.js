let container = document.querySelector(".container");
let status = container.querySelector(".status");
let page = container.querySelector(".page-agenda");
let indicator = container.querySelector(".status-indicador");
let containerHeader = container.querySelectorAll(".status > div");
let containerBody = container.querySelectorAll(".page-agenda > div");

for(let i=0;i<containerHeader.length;i++){
    containerHeader[i].addEventListener("click", function(){
        status.querySelector(".active").classList.remove("active");
        containerHeader[i].classList.add("active");
        page.querySelector(".active").classList.remove("active");
        containerBody[i].classList.add("active");
        indicator.style.left = 'calc(calc(calc(25% - 5px) * ${i}) + 10px';
    });
}