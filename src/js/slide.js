import Splitting from "splitting";

// Call the splittingjs to transform the data-splitting texts to spans of chars 
Splitting();

export default class Slide {
    constructor(el) {
        this.DOM = {el: el};
        this.DOM.chars = this.DOM.el.querySelectorAll('.word > .char, .whitespace');
        this.DOM.imgs = this.DOM.el.querySelectorAll('.slide__img');
    }
}