import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProductsService } from '@app/services/products.service';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export class MachineList {
  constructor(public item: string, public selected?: boolean) {
    if (selected === undefined) selected = false;
  }
}

@Component({
  selector: 'app-search-machines',
  templateUrl: './search-machines.component.html',
  styleUrls: ['./search-machines.component.css']
})
export class SearchMachinesComponent implements OnInit {

  searchMachineControl = new FormControl();
  searchOnlySelected: boolean = false;
  machines : MachineList[] = [];
  filteredMachines : Observable<MachineList[]>;
  selectedMachines : MachineList[] = new Array<MachineList>();
  lastFilter = '';

  faSearch = faSearch;
  faTimesCircle = faTimesCircle;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];


  constructor(private fb: FormBuilder, private productsService: ProductsService) { }

  ngOnInit(): void {
    const listOfMachines = this.productsService.getAllMachines();
    listOfMachines.forEach(m => {
      this.machines.push({
        item : m.code + ' ' + m.description
      });
    });
    /*this.searchMachineControl.valueChanges.pipe(
      startWith<string | MachineList[]>(''),
      map(value => typeof value === 'string' ? value : this.lastFilter),
      map(filter => this.filter(filter))
    ).subscribe(data => this.filteredMachines = data);*/

    this.filteredMachines = this.searchMachineControl.valueChanges.pipe(
      startWith(null),
      map((machine: MachineList | null) => machine ? this.filter(machine) : this.machines.slice()));
  }

  filter(filter: any): MachineList[] {
    this.lastFilter = filter.item;
    if (filter) {
      let s = '';
      if (filter.item) {
        s = filter.item;
      } else {
        s = filter;
      }
      return this.machines.filter(option => {
        return option.item.toLowerCase().indexOf(s.toLowerCase()) >= 0;
      })
    } else {
      return this.machines.slice();
    }
  }

  optionClicked(event: Event, item: MachineList) {
    event.stopPropagation();
    this.toggleSelection(item);
  }

  toggleSelection(item: MachineList) {
    item.selected = !item.selected;
    if (item.selected) {
      this.selectedMachines.push(item);
      // this.changeCallback( this.selectedMachines );
    } else {
      const i = this.selectedMachines.findIndex(value => value.item === item.item );
      this.selectedMachines.splice(i, 1);
      // this.changeCallback( this.selectedMachines );
    }

  }

  remove(item: MachineList) {
    this.toggleSelection(item);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.machines.push({
        item: value.trim(),
        selected : true
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.searchMachineControl.setValue(null);
  }

  /*removeFruit(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }*/

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedMachines.push({
      item : event.option.viewValue
    });
    // this.fruitInput.nativeElement.value = '';
    this.searchMachineControl.setValue(null);
  }

  /*private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }*/
}
 