import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ProductsService } from '@app/services/products.service';
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Item } from '@app/models/item';
import { Macchina } from '@app/models/OData/MacchineSet/macchineset.entity';
import { environment } from '@environments/environment';
import { MacchineSetService } from '@app/models/OData/MacchineSet/macchineset.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '@app/services/account.service';

export class MachineList {
  constructor(public item: Item, public selected?: boolean) {
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
  // necessario per trovare la macchina giusta, non è modificato dalla ricerca
  allMacchinas : Item[] = [];

  faSearch = faSearch;
  faTimesCircle = faTimesCircle;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  changedLanguaged : boolean = false;

  @Input()
  sectionToBeDisplayed: number = 0;

  @Output()
  outMacchine : EventEmitter<Item[]> = new EventEmitter<Item[]>();


  constructor(private fb: FormBuilder, private productsService: ProductsService, private macchineService: MacchineSetService,
    private spinner: NgxSpinnerService, private translateService : TranslateService, private accountService: AccountService) { }

  ngOnInit(): void {
    
    if (environment && environment.oData) {
      
      this.translateService.onLangChange.subscribe(l => {
        console.log('SearchMachinesComponent - changed language');
        this.selectedMachines = [];
        this.loadData();
      });
      this.loadData();
      
    } else {
      this.translateService.onLangChange.subscribe(l => {
        const listOfMachines = this.productsService.getAllMachines();
        listOfMachines.forEach(m => {
          const ml : MachineList = new MachineList(m);
          this.machines.push(ml);
          this.allMacchinas.push(m);
        });
        this.filteredMachines = this.searchMachineControl.valueChanges.pipe(
          startWith(null),
          map((machine: MachineList | null) => machine ? this.filter(machine) : this.machines.slice()));
      });
    }
  }

  private loadData() {
    if (this.accountService.currentPage === 1) {
      this.spinner.show();
      this.machines = [];
      this.allMacchinas = [];
      this.macchineService.getAllMachines().subscribe(resp => {
        const macchine : Item[] = [];
        if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
          console.log('search machine - resp.body.d.results.length:' + resp.body.d.results.length);
            resp.body.d.results.forEach(m => {
                if (m) {
                  const ml : MachineList = new MachineList(Macchina.fromMacchinaJson(m));
                  this.machines.push(ml);
                  macchine.push(ml.item);
                  this.allMacchinas.push(m);
                }
            });
        }
        if (this.sectionToBeDisplayed !== 1) {
          this.outMacchine.emit(macchine);
        }
        
        this.filteredMachines = this.searchMachineControl.valueChanges.pipe(
          startWith(null),
          map((machine: MachineList | null) => machine ? this.filter(machine) : this.machines.slice()));
        this.spinner.hide();
      });
    }
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
        return option.item && option.item.code && option.item.description && (option.item.code.toLowerCase().indexOf(s.toLowerCase()) >= 0 || option.item.description.toLowerCase().indexOf(s.toLowerCase())) >= 0;
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
    console.log('toggleSelection:' + item.item.code + ",selected:" + item.selected);
    item.selected = !item.selected;
    if (item.selected) {
      console.log('push the machine');
      this.selectedMachines.push(item);
      // this.changeCallback( this.selectedMachines );
    } else {
      let j = 0;
      for (j=0; j < this.selectedMachines.length; j++) {
        console.log('machine ' + j + ':code:' + this.selectedMachines[j].item.code + '-family:' +  this.selectedMachines[j].item.family);
      }
      const i = this.selectedMachines.findIndex(value => value.item.code === item.item.code && value.item.family === item.item.family );
      console.log('removing the machine:' + i + 'with code:' + item.item.code + ',family:' + item.item.family );
      this.selectedMachines.splice(i, 1);
      // this.changeCallback( this.selectedMachines );
    }
    this.search();
  }

  remove(item: MachineList) {
    this.toggleSelection(item);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


    if ((value || '').trim()) {
      this.allMacchinas.forEach(am => {
        if (am.code === value.trim() || am.description === value.trim()) {
          this.machines.push({
            item: am,
            selected : true
          });
        }
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
    this.allMacchinas.forEach(am => {
      if (am.code === event.option.viewValue || am.description === event.option.viewValue) {
        this.selectedMachines.push({
          item : am
        });
      }
    });
    
    this.searchMachineControl.setValue(null);
  }

  /*private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }*/

  search() {
      const om : Item[] = [];
      console.log("machine search:" + this.selectedMachines.length);
      if (this.selectedMachines !== undefined && this.selectedMachines.length > 0) {
        this.selectedMachines.forEach(s => om.push(s.item));
      }
      this.outMacchine.emit(om);
  }
}
 