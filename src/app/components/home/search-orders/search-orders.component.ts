import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Group } from '@app/models/item';
import { ProductsService } from '@app/services/products.service';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-orders',
  templateUrl: './search-orders.component.html',
  styleUrls: ['./search-orders.component.css']
})
export class SearchOrdersComponent implements OnInit {

  public searchForm: FormGroup;
  searchOnlySelected: boolean = false;
  groups : Group[] = [];
  groupsNames : string[] = [];

  category1 : boolean = false;
  category2 : boolean = false;
  category3 : boolean = false;
  category4 : boolean = false;
  category5 : boolean = false;
  category6 : boolean = false;

  faSearch = faSearch;

  constructor(private fb: FormBuilder, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      onlySelected: ['']
    });
    this.groups = this.productsService.getAllGroups();
    this.groups.forEach(g => {
      this.groupsNames.push(g.description);
    })
  }

  get onlySelected() {
    return this.searchForm.get('onlySelected');
  }

  public changeOnlySelected(event) {
    if (event) {
      this.searchOnlySelected = !this.searchOnlySelected;
    }
  }

  setCategory1() {
    this.category1 = !this.category1;
  }

  setCategory2() {
    this.category2 = !this.category2;
  }

  setCategory3() {
    this.category3 = !this.category3;
  }
  setCategory4() {
    this.category4 = !this.category4;
  }

  setCategory5() {
    this.category5 = !this.category5;
  }

  setCategory6() {
    this.category6 = !this.category6;
  }
}
 