import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { environment } from '@environments/environment';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  constructor(private accountService : AccountService,private router: Router,
    public bsModalRef: BsModalRef, private userDataSetService : UserDataSetService,
    private translateService: TranslateService) { }
  language : string;
  name : string;
  address : string;
  region: string;
  city: string;
  postalCode: string;
  email: string;
  country: string;

  faUserCircle=faUserCircle;

  ngOnInit(): void {
    this.language = this.accountService.userLanguage;
    if (environment && environment.oData) {
      this.name = this.userDataSetService.userDataSetValue.Kunnrx;
      this.address = this.userDataSetService.userDataSetValue.Stras;
      this.region = this.userDataSetService.userDataSetValue.Regio;
      this.city = this.userDataSetService.userDataSetValue.Ort01;
      this.postalCode = this.userDataSetService.userDataSetValue.Pstlz;
      this.email = this.userDataSetService.userDataSetValue.Email;
      this.country = this.userDataSetService.userDataSetValue.Land1;
      this.language = this.userDataSetService.userDataSetValue.Langu;
    } else {
      this.name = 'Test';
      this.address =' Via La Torre 14/H';
      this.region = 'Scarperia'
      this.city = 'Florence';
      this.postalCode = '50038';
      this.email = 'store@lamarzocco.com';
      this.country = 'ITALY';
      this.language = 'italian';
    }
    
  }
  

  public logout() {
    this.accountService.logout();
    this.bsModalRef.hide();
    setTimeout(
      () => this.router.navigate(['/account/login']),
      100
    );
  }

  public cancel() {
    this.bsModalRef.hide();
  }

  public changeLanguage() {
    if (this.language === 'italian') {
      this.language = 'english';
      this.translateService.use('en');
    } else {
      this.language = 'italian';
      this.translateService.use('it');
    }
  }
}
