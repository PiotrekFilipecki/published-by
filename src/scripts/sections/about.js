console.log('about log');


const check = document.querySelector('#about');
const pageSectionToHide = document.querySelector('.page-section__main');
const aboutSection = document.querySelector('.viewport');

if(check) {
    pageSectionToHide.classList.add('non-visible');
    aboutSection.classList.add('visible');
} else if(!check && aboutSection) {
    aboutSection.classList.add('non-visible');
}