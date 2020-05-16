import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  constructor(private accountService : AccountService,private router: Router,public bsModalRef: BsModalRef) { }
  language : string;

  ngOnInit(): void {
    this.language = this.accountService.userLanguage;
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
