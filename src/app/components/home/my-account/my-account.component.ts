import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  constructor(private accountService : AccountService,private router: Router,public bsModalRef: BsModalRef, private userDataSetService : UserDataSetService) { }
  language : string;
  name : string;
  address : string;
  region: string;
  city: string;
  postalCode: string;
  email: string;
  country: string;

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
    } else {
      this.language = 'italian';
    }
  }
}
