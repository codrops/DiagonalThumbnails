import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import { gsap } from 'gsap';
import Slide from '../slide';

export default class Slideshow {
    constructor(el) {
        this.DOM = {el: el};
        
        // Navigation buttons
        this.DOM.navigation = {
            prev: this.DOM.el.querySelector('.slides__nav--prev'),
            next: this.DOM.el.querySelector('.slides__nav--next')
        };
        // Initialize the Slide instances and store that in an array
        this.slides = [];
        [...this.DOM.el.querySelectorAll('.slide')].forEach(slide => this.slides.push(new Slide(slide)));

        // Index of the current slide
        this.current = 0;
        // Total slides
        this.slidesTotal = this.slides.length;
        // positions (in percentages) for the images movement for both directions
        // example: the second image (top right one) will translate in the y-axis -150% when clicking the next button but when clicking the prev button it will instead translate in the x-axis 150%
        this.positions = {
            x: {
                next: [-150,0,0,150],
                prev: [0,150,-150,0]
            },
            y: {
                next: [0,-150,150,0],
                prev: [-150,0,0,150]
            }
        };
        this.initEvents();
    }
    initEvents() {
        this.onClickPrevEv = () => this.navigate('prev');
        this.onClickNextEv = () => this.navigate('next');
        this.DOM.navigation.prev.addEventListener('click', () => this.onClickPrevEv());
        this.DOM.navigation.next.addEventListener('click', () => this.onClickNextEv());
    }
    navigate(direction) {
        if ( this.isAnimating ) {
            return false;
        }
        
        const currentSlide = this.slides[this.current];
        this.current = direction === 'next' ? 
            this.current < this.slidesTotal-1 ? ++this.current : 0:
            this.current > 0 ? --this.current : this.slidesTotal-1;
        const nextSlide = this.slides[this.current];

        gsap.timeline({
            defaults: {duration: 0.8, ease: 'power4.inOut'},
            onStart: () => this.isAnimating = true,
            onComplete: () => {
                // Remove "current" class
                currentSlide.DOM.el.classList.remove('slide--current');
                this.isAnimating = false;
            }
        })
        .addLabel('start', 0)
        // Animate current title out (stagger the characters)
        .to(currentSlide.DOM.chars, {
            y: direction === 'next' ? '100%' : '-100%',
            rotation: direction === 'next' ? 3 : -3,
            stagger: direction === 'next' ? -0.015 : 0.015
        }, 'start')
        // Animate current images out
        .to(currentSlide.DOM.imgs, {
            x: pos => `${this.positions.x[direction][pos]}%`,
            y: pos => `${this.positions.y[direction][pos]}%`,
            opacity: 0,
            stagger: 0.1
        }, 'start')
        .addLabel('upcoming', 0.4)
        .add(() => {
            // Set up upcoming images and text default style:
            gsap.set(nextSlide.DOM.imgs, {opacity: 0});
            gsap.set(nextSlide.DOM.chars, {
                y: direction === 'next' ? '-100%' : '100%', 
                rotation: direction === 'next' ? 3 : -3
            });
            // Add "current" class
            nextSlide.DOM.el.classList.add('slide--current');
        }, 'upcoming')
        // Animate upcoming title in (stagger the characters)
        .to(nextSlide.DOM.chars, {
            y: '0%',
            rotation: 0,
            ease: 'power4',
            stagger: direction === 'next' ? -0.015 : 0.015
        }, 'upcoming')
        // Animate upcoming images in
        .to(nextSlide.DOM.imgs, {
            startAt: {
                x: pos => `${this.positions.x[this.reverseDirection(direction)][pos]}%`,
                y: pos => `${this.positions.y[this.reverseDirection(direction)][pos]}%`,
            },
            x: '0%',
            y: '0%',
            opacity: 0.4,
            ease: 'power4',
            stagger: 0.1
        }, 'upcoming');
    }
    reverseDirection(direction) {
        return direction === 'next' ? 'prev' : 'next';
    }
}