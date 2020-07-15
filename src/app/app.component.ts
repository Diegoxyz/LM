import { Component, Input, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ODataSettingsService } from './_helpers/oDataSettings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lm';

  @Input() token: string;

  constructor(translate: TranslateService, private oDataSettingsService : ODataSettingsService) {
    translate.addLangs(['en', 'it'])
    translate.setDefaultLang('en');
    translate.use('en');
  }

}
