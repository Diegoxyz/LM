import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  constructor(private accountService : AccountService) { }

  ngOnInit(): void {
  }

  public logout() {
    this.accountService.logout();
  }
}
