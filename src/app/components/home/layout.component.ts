import { Component, Output, EventEmitter } from '@angular/core';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import { AccountService } from '@app/services/account.service';

@Component({ 
    templateUrl: 'layout.component.html',
    styleUrls:  ['layout.component.css']
})

export class LayoutComponent {
    
    faAngleUp=faAngleUp;

    constructor(private accountService: AccountService, translate: TranslateService) {
        translate.addLangs(['en', 'it'])
        translate.setDefaultLang('en');
        const lang = this.accountService.getLanguage();
        console.log('using this lang:' + lang);
        translate.use(lang);
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