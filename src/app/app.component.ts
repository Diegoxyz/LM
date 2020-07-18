import { Component, Input, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ODataSettingsService } from './_helpers/oDataSettings.service';
import { Title }     from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Portale Ricambi';

  @Input() token: string;

  constructor(translate: TranslateService, private oDataSettingsService : ODataSettingsService, private titleService: Title) {
    const lang = navigator.language;
    console.log('appcomponent - lang:' + lang);
    let l = 'en';
    let newTitle = 'Spare Parts Portal';
    if (lang) {
        if (lang === 'it-IT') {
            l = 'it';
            newTitle = 'Portale Ricambi';
        } else if (lang === 'it') {
            l = 'it';
            newTitle = 'Portale Ricambi';
        }
    }
    translate.addLangs(['en', 'it'])
    translate.setDefaultLang(l);
    translate.use(l);
    this.titleService.setTitle( newTitle );
  }

}
