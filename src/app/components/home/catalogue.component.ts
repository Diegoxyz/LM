import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogueService } from '@app/services/catalogue.service';
import { environment } from '@environments/environment';
import { Materiale } from '@app/models/OData/MacchineSet/macchineset.entity';

@Component({selector: 'app-catalogue',
templateUrl: './catalogue.component.html',
styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {

    groupId: string;

    items : Product[] =[];

    // To avoid to call the service to retrieve all the products too many times
    cachedItems : Product[] =[];
  
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
        private route: ActivatedRoute, private catalogueService : CatalogueService
    ) {
        
    }

    ngOnInit() {
        
        if (environment && environment.oData) {
            this.catalogueService.getAllItems().subscribe(resp => {
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(m => {
                        if (m) {
                            this.items.push(Materiale.fromJSON(m));
                            this.cachedItems.push(Materiale.fromJSON(m));
                        }
                    });
                }
            });
        } else {
            this.sub = this.route.params.subscribe(params => {
                this.groupId = params['groupId']; 
               // add the loading of all the items for a group
               this.items = this.productsService.getAllProducts();
               this.cachedItems = this.productsService.getAllProducts();
             });
        }
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        
      }

    onTop(): void {
        window.scroll(0,0);
    }
    
    filterProducts(products : Product[]) {
        if (products) {
            this.items = [];

            if (products.length > 0) {
                products.forEach(p => this.items.push(p));
            } else {
                this.items = this.cachedItems;
            }
        }

    }
}