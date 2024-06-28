

let nextDom = document.getElementById('next-btn');
let prevDom = document.getElementById('prev-btn');
 
let carouselDom = document.querySelector('.container-empresaPremium');
let SliderDom = carouselDom.querySelector('.container-empresaPremium .slidesrow');

 
let timeDom = document.querySelector('.container-empresaPremium .time');
 
let timeRunning = 3000;
let timeAutoNext = 7000;
 
nextDom.onclick = function(){
    showSlider('next-btn');    
}
 
prevDom.onclick = function(){
    showSlider('prev-btn');    
}
let runTimeOut;
let runNextAuto = setTimeout(() => {
    next.click();
}, timeAutoNext)
function showSlider(type){
    let  SliderItemsDom = SliderDom.querySelectorAll('.container-empresaPremium .slidesrow .slide-empresaP');
   
   
    if(type === 'next'){
        SliderDom.appendChild(SliderItemsDom[0]);
        carouselDom.classslidesrow.add('next-btn');
    }else{
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        carouselDom.classList.add('prev-btn');
    }
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next-btn');
        carouselDom.classList.remove('prev-btn');
    }, timeRunning);
 
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        next.click();
    }, timeAutoNext)
}