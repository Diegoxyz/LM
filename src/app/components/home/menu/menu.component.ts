import { Component, OnInit } from '@angular/core';
/* aggiunti per popolamento item */
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { faBookOpen, faClipboardCheck,faDraftingCompass, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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

 constructor(private productsService: ProductsService,
  private fb : FormBuilder,
  private router: Router,
) {
  
}

ngOnInit() {
  this.groups = this.productsService.getAllGroups();
  this.items = this.productsService.getAllProducts();
}

openCatalogue(g : Group) {
  if (g) {
    this.router.navigate(['./home/catalogue'], {queryParams:{selected: g}});
  }
  
}

}
