import { Component, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/models/item';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

@Component({ 
    templateUrl: 'layout.component.html',
    styleUrls:  ['layout.component.css']
})

export class LayoutComponent {
    
    faAngleUp=faAngleUp;

    constructor(
    ) {
    }

    onActivate(event) {
        window.scroll(0,0);
        //or document.body.scrollTop = 0;
        //or document.querySelector('body').scrollTo(0,0)
    }

    onScrollTop(): void {
        window.scroll(0,0);
      }   
    
}