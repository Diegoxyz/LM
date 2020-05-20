import { Component, OnInit } from '@angular/core';
/* aggiunti per popolamento item */
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faBookOpen, faClipboardCheck,faDraftingCompass, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ChangePage } from '../services/change-page.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  /* old 
  constructor() { }
  ngOnInit(): void {
  }
  */

 groups : Group[] = []; 
 selected: Group;

 items : Product[] =[];

 faBookOpen = faBookOpen;
 faClipboardCheck = faClipboardCheck;
 faDraftingCompass = faDraftingCompass;

 currentPage : number = 0;

 constructor(private productsService: ProductsService,
  private fb : FormBuilder,
  private router: Router,
  private changePage: ChangePage
) {
  
}

  ngOnInit() {
    this.groups = this.productsService.getAllGroups();
    this.items = this.productsService.getAllProducts();
    this.currentPage = 0;
    this.changePage.page$.subscribe((p : number) => {
      if (p !== undefined && p >= 0 && p <= 3) {
        this.currentPage = p;
      } 
    });
  }

  openCatalogue(g : Group) {
    if (g) {
      this.router.navigate(['./home/catalogue'], {queryParams:{selected: g}});
    }
  }

  goToCatalogue() {
    this.currentPage = 1;
    this.router.navigate(['./home/catalogue']);
  }

  goToBoards() {
    this.currentPage = 2;
    this.router.navigate(['./home/boards']);
  }

  goToOrders() {
    this.currentPage = 3;
    this.router.navigate(['./home/orders']);
  }
}
