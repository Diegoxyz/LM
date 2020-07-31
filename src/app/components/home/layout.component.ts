import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import { AccountService } from '@app/services/account.service';

@Component({ 
    templateUrl: 'layout.component.html',
    styleUrls:  ['layout.component.css']
})

export class LayoutComponent implements OnInit{
    
    faAngleUp=faAngleUp;

    constructor(private accountService: AccountService, private translate: TranslateService) {
      }
    
    ngOnInit(): void {
        this.translate.addLangs(['en', 'it'])
        this.translate.setDefaultLang('en');
        const lang = this.accountService.getLanguage();
        console.log('LayoutComponent using this lang:' + lang);
        this.translate.use(lang);
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