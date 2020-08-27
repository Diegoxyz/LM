import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.css']
})
export class LoginBarComponent implements OnInit {

  @Input() pageToShow = 1;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goRegistration() {
    this.displayMobileMenu();
  }

  goLostCredentials() {
    // this.router.navigate(['lostCredentials']);
    this.displayMobileMenu();
  }

  displayMobileMenu() {
    let x = document.getElementById("myLinks");
    if (x) {
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }
  }
}
