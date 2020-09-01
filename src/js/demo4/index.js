import { preloadImages, preloadFonts } from '../utils';
import Cursor from '../cursor';
import Slideshow from './slideshow';

// Preload  images and fonts
Promise.all([preloadImages('.slide__img'), preloadFonts('ldj8uhs')]).then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');

    // Initialize custom cursor
    const cursor = new Cursor(document.querySelector('.cursor'));

    // Initialize the slideshow
    new Slideshow(document.querySelector('.slides'));
    
    // mouse cursor hovers
    [...document.querySelectorAll('a'), ...document.querySelectorAll('.slides__nav')].forEach(link => {
        link.addEventListener('mouseenter', () => cursor.enter());
        link.addEventListener('mouseleave', () => cursor.leave());
    });
});
