import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Group } from '@app/models/item';
import { ProductsService } from '@app/services/products.service';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css']
})
export class SearchProductsComponent implements OnInit {

  public searchForm: FormGroup;
  searchOnlySelected: boolean = false;
  groups : Group[] = [];

  constructor(private fb: FormBuilder, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      onlySelected: ['']
    });
    this.groups = this.productsService.getAllGroups();
  }

  get onlySelected() {
    return this.searchForm.get('onlySelected');
  }

  public changeOnlySelected(event) {
    if (event) {
      this.searchOnlySelected = !this.searchOnlySelected;
    }
  }
}
