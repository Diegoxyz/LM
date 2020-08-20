import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Group, Product } from '@app/models/item';
import { ProductsService } from '@app/services/products.service';
import { faSearch,faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CatalogueService } from '@app/services/catalogue.service';
import { environment } from '@environments/environment';
import { Materiale } from '@app/models/OData/MacchineSet/macchineset.entity';
import { AccountService } from '@app/services/account.service';
import { TranslateService } from '@ngx-translate/core';

export class GroupList {
  constructor(public group: Group, public selected?:boolean) {
    if (selected === undefined) selected = false;
  }
}

export class ItemList {
  constructor(public item: Product, public selected?: boolean) {
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
  groups : GroupList[] = [];
  filteredGroups : Observable<GroupList[]>;
  selectedGroups : GroupList[] = new Array<GroupList>();
  lastGroupFilter = '';
  allGroups : Group[] = [];

  faSearch = faSearch;
  faTimesCircle = faTimesCircle;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @Output()
  outProducts : EventEmitter<Product[]> = new EventEmitter<Product[]>();

  @Input()
  searchLastProducts? : string;

  @Input()
  searchKey? : string;
  
  @Input()
  allProducts : Product[];
  
  searchProductValue : string = '';

  constructor(private fb: FormBuilder, private productsService: ProductsService, private catalogueService : CatalogueService,
    private accountService : AccountService, private translateService: TranslateService) { }

  ngOnInit(): void {
    if (this.searchKey !== undefined && this.searchKey !== null) {
      this.searchProductValue = this.searchKey;
    } else {
      this.searchProductValue = '';
    }
    console.log('searchKey:' + this.searchKey + ',searchProductValue:' + this.searchProductValue);
    if (environment && environment.oData) {
      this.accountService.currentPage = 2;
      this.translateService.onLangChange.subscribe(l => {
        console.log('SearchProductsComponent - changed language');
        this.loadData();
        this.selectedGroups = [];
      });
      this.loadData();
    } else {
      const listOfGroups = this.productsService.getAllGroups();
      listOfGroups.forEach(g => {
        this.groups.push({
          group : g
        });
        this.allGroups.push(g);
      });
      this.filteredGroups = this.searchGroupControl.valueChanges.pipe(
        startWith(null),
        map((group: GroupList | null) => group ? this.filterGroup(group) : this.groups.slice()));

      /*const listOfProducts = this.productsService.getAllProducts();
      listOfProducts.forEach(m => {
        this.products.push({
          item : m
        });
        this.allProducts.push(m);
      });*/
      this.filteredProducts = this.searchProductControl.valueChanges.pipe(
        startWith(null),
        map((product: ItemList | null) => product ? this.filterProduct(product) : this.products.slice()));
      }
    
  }

  private loadData() {
    if (this.accountService.currentPage === 2) {
      this.groups = [];
      this.allGroups = [];
      this.catalogueService.getHierarchies().subscribe(resp => {
        if (resp && resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
          resp.body.d.results.forEach(g => {
            const gr : Group = new Group(g.Prodh,g.Prodhx);
            this.groups.push({
              group : gr
            });
            this.allGroups.push(g);
          });
          this.filteredGroups = this.searchGroupControl.valueChanges.pipe(
            startWith(null),
            map((group: GroupList | null) => group ? this.filterGroup(group) : this.groups.slice()));
        }
      });
      
      this.filteredProducts = this.searchProductControl.valueChanges.pipe(
        startWith(null),
        map((product: ItemList | null) => product ? this.filterProduct(product) : this.products.slice()));
    }
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
        return option.item && option.item.code && option.item.description && (option.item.code.toLowerCase().indexOf(s.toLowerCase()) >= 0 || option.item.description.toLowerCase().indexOf(s.toLowerCase()) >= 0);
      })
    } else {
      return this.products.slice();
    }
  }

  filterGroup(filter: any): GroupList[] {
    this.lastGroupFilter = filter.item;
    if (filter) {
      let s = '';
      if (filter.item) {
        s = filter.item;
      } else {
        s = filter;
      }
      return this.groups.filter(option => {
        return option.group && option.group.code && option.group.description && (option.group.code.toLowerCase().indexOf(s.toLowerCase()) >= 0 || option.group.description.toLowerCase().indexOf(s.toLowerCase()) >= 0);
      })
    } else {
      return this.groups.slice();
    }
  }

  optionClickedProduct(event: Event, item: ItemList) {
    event.stopPropagation();
    this.toggleSelectionProduct(item);
  }

  optionClickedGroup(event: Event, item: GroupList) {
    event.stopPropagation();
    this.toggleSelectionGroup(item);
  }

  toggleSelectionProduct(item: ItemList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedProducts.push(item);
      // this.changeCallback( this.selectedMachines );
    } else {
      const i = this.selectedProducts.findIndex(value => value.item.code === item.item.code );
      this.selectedProducts.splice(i, 1);
      // this.changeCallback( this.selectedMachines );
    }

  }

 toggleSelectionGroup(item: GroupList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedGroups.push(item);
      // this.changeCallback( this.selectedMachines );
    } else {
      const i = this.selectedGroups.findIndex(value => value.group.code === item.group.code );
      this.selectedGroups.splice(i, 1);
      // this.changeCallback( this.selectedMachines );
    }
    this.search();
  }

  removeProduct(item: ItemList) {
    this.toggleSelectionProduct(item);
  }

  removeGroup(item: GroupList) {
    this.toggleSelectionGroup(item);
  }

  addProduct(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.allProducts.forEach(ap => {
        if (ap.code === value.trim() || ap.description === value.trim()) {
          this.products.push({
            item: ap,
            selected : true
          });
        }
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.searchProductControl.setValue(null);
  }

  addGroup(event: MatChipInputEvent): void {
    console.log('addGroup');
    const input = event.input;
    const value = event.value;

    // alert('addGroup');

    if ((value || '').trim()) {
      this.allGroups.forEach(ag => {
        if (ag.code === value.trim() || ag.description === value.trim()) {
          this.groups.push({
            group: ag,
            selected: true
          })
        }
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.searchGroupControl.setValue(null);
  }

  selectedProduct(event: MatAutocompleteSelectedEvent): void {
    this.allProducts.forEach(am => {
      if (am.code === event.option.viewValue || am.description === event.option.viewValue) {
        this.selectedProducts.push({
          item : am
        });
      }
    });

    this.searchProductControl.setValue(null);
  }

  selectedGroup(event: MatAutocompleteSelectedEvent): void {
    this.allGroups.forEach(ag => {
      if (ag.code === event.option.viewValue || ag.description === event.option.viewValue) {
        this.selectedGroups.push({
          group : ag
        });
      }
    });

    this.searchGroupControl.setValue(null);
  }

  get onlySelected() {
    return this.searchForm.get('onlySelected');
  }

  public changeOnlySelected(event) {
    this.searchOnlySelected = !this.searchOnlySelected;
    this.search();
  }

  search() {
    if (this.allProducts === undefined || this.allProducts === null) {
      this.allProducts = [];
    }
    let om : Product[] = [];

    let filter = (<HTMLInputElement>document.getElementById('productSearch')).value;

    if (filter !== undefined || filter.length > 0 ) {
      om = this.allProducts.filter(
                                          product => product.code.toLowerCase().indexOf(filter.toLowerCase()) > -1 ||
                                          product.description.toLowerCase().indexOf(filter.toLowerCase()) > -1
                                          );
    } else {
      om = this.allProducts;
    }

    if (this.searchOnlySelected) {
      om = om.filter(p => p.preferred);
    }

	/*----------------------------------*/

    let os : Product[] = om;
    console.log('os.length1:' + os.length);
    if (this.selectedGroups !== undefined && this.selectedGroups.length > 0) {
      os = [];
      this.selectedGroups.forEach(g => {
        if (om.length > 0) {
          om.forEach(o => {
            console.log('selected groups - checking1:' + o.prodh + '-' + g.group.code);
            if (o.prodh.indexOf(g.group.code) > -1) {
              console.log('checking1 - adding:' + o.prodhx)
              os.push(o);
            }
          })
        } else if (this.allProducts.length > 0) {
          this.allProducts.forEach(p => {
            console.log('selected groups - checking2:' + p.prodh + '-' + g.group.code);
            if (p.prodh.indexOf(g.group.code) > -1) {
              console.log('checking2 - adding:' + p.prodhx)
              os.push(p);
            }
          })
        }
      });
    }
    console.log('os.length2:' + os.length);
    this.outProducts.emit(os);
  }

}
 