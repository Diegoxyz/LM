import { Component, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/models/item';


@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
    
    constructor(
    ) {
    }

    onActivate(event) {
        window.scroll(0,0);
        //or document.body.scrollTop = 0;
        //or document.querySelector('body').scrollTo(0,0)
    }
}