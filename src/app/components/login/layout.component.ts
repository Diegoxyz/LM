import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import {TranslateService} from '@ngx-translate/core';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
    constructor(
        private router: Router,
        private accountService: AccountService,
        translate: TranslateService
    ) {
        // redirect to home if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/boards']);
        }
        translate.addLangs(['en', 'it'])
        translate.setDefaultLang('en');
        const lang = this.accountService.getLanguage();
        translate.use(lang);
    }
}