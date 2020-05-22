import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Group } from '@app/models/item';
import { ProductsService } from '@app/services/products.service';
import { faSearch,faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export class ItemList {
  constructor(public item: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css']
})
export class SearchProductsComponent implements OnInit {

  public searchForm: FormGroup;
  searchOnlySelected: boolean = false;

  searchProductControl = new FormControl();
  searchOnlySelectedProduct: boolean = false;
  products : ItemList[] = [];
  filteredProducts : Observable<ItemList[]>;
  selectedProducts : ItemList[] = new Array<ItemList>();
  lastProductFilter = '';

  searchGroupControl = new FormControl();
  searchOnlySelectedGroup: boolean = false;
  groups : ItemList[] = [];
  filteredGroups : Observable<ItemList[]>;
  selectedGroups : ItemList[] = new Array<ItemList>();
  lastGroupFilter = '';

  faSearch = faSearch;
  faTimesCircle = faTimesCircle;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private fb: FormBuilder, private productsService: ProductsService) { }

  ngOnInit(): void {
    const listOfGroups = this.productsService.getAllGroups();
    listOfGroups.forEach(g => {
      this.groups.push({
        item : g.code + ' ' + g.description
      });
    });
    this.filteredGroups = this.searchGroupControl.valueChanges.pipe(
      startWith(null),
      map((group: ItemList | null) => group ? this.filterGroup(group) : this.groups.slice()));

    const listOfProducts = this.productsService.getAllProducts();
    listOfProducts.forEach(m => {
      this.products.push({
        item : m.code + ' ' + m.description
      });
    });
    this.filteredProducts = this.searchProductControl.valueChanges.pipe(
      startWith(null),
      map((product: ItemList | null) => product ? this.filterProduct(product) : this.products.slice()));
  }

  filterProduct(filter: any): ItemList[] {
    this.lastProductFilter = filter.item;
    if (filter) {
      let s = '';
      if (filter.item) {
        s = filter.item;
      } else {
        s = filter;
      }
      return this.products.filter(option => {
        return option.item.toLowerCase().indexOf(s.toLowerCase()) >= 0;
      })
    } else {
      return this.products.slice();
    }
  }

  filterGroup(filter: any): ItemList[] {
    this.lastGroupFilter = filter.item;
    if (filter) {
      let s = '';
      if (filter.item) {
        s = filter.item;
      } else {
        s = filter;
      }
      return this.groups.filter(option => {
        return option.item.toLowerCase().indexOf(s.toLowerCase()) >= 0;
      })
    } else {
      return this.groups.slice();
    }
  }

  optionClickedProduct(event: Event, item: ItemList) {
    event.stopPropagation();
    this.toggleSelectionProduct(item);
  }

  optionClickedGroup(event: Event, item: ItemList) {
    event.stopPropagation();
    this.toggleSelectionGroup(item);
  }

  toggleSelectionProduct(item: ItemList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedProducts.push(item);
      // this.changeCallback( this.selectedMachines );
    } else {
      const i = this.selectedProducts.findIndex(value => value.item === item.item );
      this.selectedProducts.splice(i, 1);
      // this.changeCallback( this.selectedMachines );
    }

  }

  toggleSelectionGroup(item: ItemList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedGroups.push(item);
      // this.changeCallback( this.selectedMachines );
    } else {
      const i = this.selectedGroups.findIndex(value => value.item === item.item );
      this.selectedGroups.splice(i, 1);
      // this.changeCallback( this.selectedMachines );
    }

  }

  removeProduct(item: ItemList) {
    this.toggleSelectionProduct(item);
  }

  removeGroup(item: ItemList) {
    this.toggleSelectionGroup(item);
  }

  addProduct(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.products.push({
        item: value.trim(),
        selected : true
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.searchProductControl.setValue(null);
  }

  addGroup(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.groups.push({
        item: value.trim(),
        selected : true
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.searchGroupControl.setValue(null);
  }

  /*removeFruit(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }*/

  selectedProduct(event: MatAutocompleteSelectedEvent): void {
    this.selectedProducts.push({
      item : event.option.viewValue
    });
    // this.fruitInput.nativeElement.value = '';
    this.searchProductControl.setValue(null);
  }

  selectedGroup(event: MatAutocompleteSelectedEvent): void {
    this.selectedGroups.push({
      item : event.option.viewValue
    });
    // this.fruitInput.nativeElement.value = '';
    this.searchGroupControl.setValue(null);
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
 