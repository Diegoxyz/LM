import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product} from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({selector: 'app-boards',
templateUrl: './boards.component.html',
styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

    groups : Group[] = []; 
    selected: Group;
    
    items : Product[] =[];
  
    config = {
        itemsPerPage: 9,
        currentPage: 1,
        totalItems: this.items.length
    };

    public maxSize: number = 9;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public responsive: boolean = true;
    public labels: any = {
        previousLabel: '<--',
        nextLabel: '-->',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };

    constructor(private productsService: ProductsService,
        private fb : FormBuilder
    ) {
       /*  this.groups = this.productsService.getAllGroups(); */
    }

    ngOnInit() {
        this.groups = this.productsService.getAllGroups();
        this.items = this.productsService.getAllProducts();
    }

    
    get page(){
        return this.config.currentPage;
      }
    
    get pageSize(){
    return this.config.itemsPerPage;
    }

    onPageChange(event){
    console.log(event);
    this.config.currentPage = event;
    }

}