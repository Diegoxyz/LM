import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({selector: 'app-catalogue',
templateUrl: './catalogue.component.html',
styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {

    groups : Group[] = []; 

    constructor(private productsService: ProductsService,
        private fb : FormBuilder
    ) {
        this.groups = this.productsService.getAllGroups();
    }

    ngOnInit() {
    }
        
}