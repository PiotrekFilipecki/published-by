import Preloader from '../sections/loader';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';
import $ from 'jquery';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

//js for sections
import '../sections/header';
import '../sections/about';
window.addEventListener('load', () => {
  Preloader.hide();
});



import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';
import {cookiesEnabled} from '@shopify/theme-cart';



// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}


// const homeVideoHandler = (desktop, mobile) => {
//     const videoSection = document.
//     mobile = document.createElement('img');
//     mobile.setAttribute('src', 'hehe');
//     mobile.createAttribute('alt');
//     document.querySelector('section.video').appendChild(mobile);
//     console.log('appended');
// };

// homeVideoHandler();

const detectWidthForVideo = () => {
  const mobileVideo = document.querySelector('.video-mobile')
  const desktopVideo = document.querySelector('.video-desktop')
  if(screen.width > 800) {
    desktopVideo.classList.add('visible')
  } else {
    mobileVideo.classList.add('visible')
  }
}

detectWidthForVideo();