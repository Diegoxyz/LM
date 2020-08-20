import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public language : string;
  
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.language = this.accountService.getLanguage();
  }

}
