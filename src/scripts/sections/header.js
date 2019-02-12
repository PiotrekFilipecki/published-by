
const logo = document.querySelector('#mainLogo');
const navBox = document.querySelector('#navBox');
const neededHeight = document.querySelector('#navBox ul').clientHeight;


//toggler function
const toggler = () => {
    logo.classList.toggle('nav-menu__logo--animated');
    navBox.classList.toggle('nav-menu__box--opened');

    if(navBox.hasAttribute('style')){
        navBox.removeAttribute('style');
    }else{
        navBox.style.maxHeight = neededHeight + 'px';
    }
}

//session check open menu function
const changeState = () => {
    if( sessionStorage.isMenuOpen == 'opened'){
        toggler();
        sessionStorage.isMenuOpen = 'colsed';
        console.log('zamknięto');
    }else{
        toggler();
        sessionStorage.isMenuOpen = 'opened';
        console.log('otwarto');
    }
};

const firstCheckSession = () => { 
    if( sessionStorage.isMenuOpen == 'opened'){
        toggler();
        console.log('ustawiono na otwarte');
    }else{
        console.log('zostaw jak jest');
    }
};

logo.addEventListener('click', (e) => {
        e.preventDefault();
        changeState();
    }, true);


//first check session
firstCheckSession();







//code for el modaloo

const coverItems = document.querySelectorAll('.covers__item');
const modalItems = document.querySelectorAll('.modal__background');

console.log(coverItems);

coverItems.forEach( (el) => {
  el.addEventListener('click', () => {

    const id = el.getAttribute('data-id');

    modalItems.forEach( (el)=>{
      if (id === el.getAttribute('id')){
        el.classList.remove('hide');
        setTimeout(()=>{
          el.querySelector('.modal__text').classList.add('opened');
        }, 1);
      }
    });

  }, true);
});

modalItems.forEach( (el)=>{
  el.addEventListener('click', (e)=>{
    if (e.target.classList.contains('modal__background') || e.target.classList.contains('close')){
      el.classList.add('hide');
      el.querySelector('.modal__text').classList.remove('opened');
    }
  }, true);
});

// function close(el){
//   el.classList.add('hide');
//   console.log(el);
// };