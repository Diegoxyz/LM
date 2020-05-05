import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({selector: 'app-boards',
templateUrl: './boards.component.html',
styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit {

    groups : Group[] = []; 
    selected: Group;
    
    constructor(private productsService: ProductsService,
        private fb : FormBuilder
    ) {
        this.groups = this.productsService.getAllGroups();
    }

    ngOnInit() {
    }
        
}