import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({selector: 'app-catalogue',
templateUrl: './catalogue.component.html',
styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

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