import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({selector: 'app-catalogue',
templateUrl: './catalogue.component.html',
styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {

    groupId: string;

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

    private sub: any;

    constructor(private productsService: ProductsService,
        private fb : FormBuilder,
        private route: ActivatedRoute
    ) {
        
    }

    ngOnInit() {
        
        this.sub = this.route.params.subscribe(params => {
            this.groupId = params['groupId']; 
           // add the loading of all the items for a group
           this.items = this.productsService.getAllProducts();
         });
        
        
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
      }
}