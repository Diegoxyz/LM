import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product } from 'src/app/models/item';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CatalogueService } from '@app/services/catalogue.service';
import { environment } from '@environments/environment';
import { Materiale } from '@app/models/OData/MacchineSet/macchineset.entity';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-catalogue',
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {

    groupId: string;

    items: Product[] = [];

    itemsToView: Product[] = [];
    imagesToView: number = 3;

    // To avoid to call the service to retrieve all the products too many times
    cachedItems: Product[] = [];

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

    searchLastProducts? : string;
    searchKey? : string;

    displaySpinner = false;

    constructor(private productsService: ProductsService,
        private fb: FormBuilder,
        private route: ActivatedRoute, private catalogueService: CatalogueService, private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit() {

        if (environment && environment.oData) {
            this.spinner.show();
            const lastPurchases = this.route.snapshot.paramMap.get('lastPurchases');
            this.searchLastProducts = lastPurchases;
            console.log('lastPurchases:' + lastPurchases);
            const searchKey = this.route.snapshot.paramMap.get('searchKey');
            this.searchKey = searchKey;
            console.log('searchKey:' + searchKey);
            this.catalogueService.getAllItems(lastPurchases, searchKey).subscribe(resp => {
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(m => {
                        if (m) {
                            this.items.push(Materiale.fromJSON(m));
                            this.cachedItems.push(Materiale.fromJSON(m));
                        }
                    });
                }
                const imagesForRow = this.items.length > this.imagesToView ? this.imagesToView : this.items.length;
                console.log('catalogue - imagesForRow:' + imagesForRow);
                for (let i = 0; i < imagesForRow; i++) {
                    this.itemsToView.push(this.items[i]);
                }
                // document.getElementById('myModal').style.display = "none"
                this.spinner.hide(); 
            }
            );
        } else {
            console.log('environment = LOCAL');
            const searchKey = this.route.snapshot.paramMap.get('searchKey');
            this.searchKey = searchKey;
            console.log('searchKey:' + searchKey);
            this.sub = this.route.params.subscribe(params => {
                console.log('environment = LOCAL - popola 1');
                this.groupId = params['groupId'];
                // add the loading of all the items for a group
                this.items = this.productsService.getAllProducts();
                const imagesForRow = this.items.length > this.imagesToView ? this.imagesToView : this.items.length;
                for (let i = 0; i < imagesForRow; i++) {
                    this.itemsToView.push(this.items[i]);
                }
                this.cachedItems = this.productsService.getAllProducts();
            }
            );

            this.items = this.productsService.getAllProducts();
            const imagesForRow = this.items.length > this.imagesToView ? this.imagesToView : this.items.length;
            for (let i = 0; i < imagesForRow; i++) {
                this.itemsToView.push(this.items[i]);
            }
            console.log('environment = LOCAL - popola 2');
            this.cachedItems = this.productsService.getAllProducts();

            try {
                console.log('environment = LOCAL - prova ciusura');
                if (document.getElementById('myModal')) {
                    setTimeout(function () { 
                        document.getElementById('myModal').style.display = "none"; }, 3000);
                }
            } catch (Error) {
                // alert(Error.message);
            }
        }

    }

    @HostListener('window:scroll', ['$event']) // for window scroll events
    onScroll(event) {
        if (this.imagesToView < this.items.length) {
            this.imagesToView += 3;
            const imagesForRow = this.items.length > this.imagesToView ? this.imagesToView : this.items.length;
            for (let i = this.imagesToView - 3; i < imagesForRow; i++) {
                this.itemsToView.push(this.items[i]);
            }
        }
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }

    }

    onTop(): void {
        window.scroll(0, 0);
    }

    filterProducts(products: Product[]) {
        if (products) {
            this.displaySpinner = true;
            this.itemsToView = [];
            this.items = [];
            if (products.length > 0) {
                products.forEach(p => this.items.push(p));
                this.imagesToView = 3;
                const imagesForRow = this.items.length > this.imagesToView ? this.imagesToView : this.items.length;
                for (let i = 0; i < imagesForRow; i++) {
                    this.itemsToView.push(this.items[i]);
                }
            }
            this.displaySpinner = false;
        }

    }
}