import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProductsService } from '@app/services/products.service';
import { Product, Item } from '@app/models/item';
import { environment } from '@environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { BinDataMatnrSetService } from '@app/models/OData/BinDataMatnrSet/bindatamatnrset.service';
import { SectionMaterial } from '@app/services/section-material.service';
import { Materiale } from '@app/models/OData/MacchineSet/macchineset.entity';
import { CarrelloService } from '@app/services/carrello.service';
import { AccountService } from '@app/services/account.service';
import { Carrello } from '@app/models/carrello';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { CartService } from '@app/services/cart.service';
import { ManageProducts } from '../services/manage-products.service';

@Component({selector: 'app-prospetive-card',
templateUrl: './prospective-card.component.html',
styleUrls: ['./prospective-card.component.css']
})
export class ProspectiveCardComponent implements OnInit {

    @Input()
    item : Item;

    quantity : number = 0;
    selectedQuantity : number = 0;
    faShoppingCart=faShoppingCart;
    faCircle=faCircle;

    bsModalRef: BsModalRef;

    items : Product[] =[];

    thumbnail: any;

    svgThumbnail: any;

    // just for test with no odata
    svgData = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNDcycHgiIGhlaWdodD0iMzkycHgiIHZpZXdCb3g9IjAgMCA0NzIgMzkyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0NzIgMzkyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIGlkPSJMYXllcl8zIj4NCgk8cGF0aCBmaWxsPSIjRkZCNTY0IiBkPSJNMjg4LjcsMTg3LjdjLTUzLjctMzIuNi0xMTkuOCwxLTExOS44LDFzMTEuNiw5Mi42LDExLjQsMTIxLjRjLTAuOCwyLTEsNC4xLTAuNCw2LjMNCgkJYy0wLjIsMS4yLTAuNiwxLjctMSwxLjdoMS43YzEuMSwzLDIuOSw0LjMsNS44LDUuM2MxMC45LDQsMjEuNSw2LjgsMzMuMSw3LjdjMy42LDAuMyw3LjEsMC4yLDEwLjUtMC4yYzEuNiwxLjUsNCwyLjQsNy4xLDIuMQ0KCQljMTMuMi0xLjIsMjgtMS45LDM4LjYtMTAuM2MxLjctMS40LDIuNy0yLjcsMy4xLTQuN2gwLjhMMjg4LjcsMTg3Ljd6Ii8+DQoJPHBvbHlnb24gZmlsbD0iIzUyRTJENyIgcG9pbnRzPSIxNzMuMiwxNDYuNCAxODAuNSwxODQgMjA2LjYsMTc3LjIgMjAwLjEsMTQ0IAkiLz4NCgk8cGF0aCBmaWxsPSIjRkZGQkU4IiBkPSJNMjIyLjYsMTMzLjhjMCwwLTE3LjktMTUuNi01LjMsMzkuOWMwLjYsMi41LDE5LjQsMy40LDE5LjQsMy40TDIyMi42LDEzMy44eiIvPg0KCTxwYXRoIGZpbGw9IiNGOUEwMzUiIGQ9Ik0xODguNiwxODEuNGMwLDAtMjAuNiwwLTIwLjYsMTIuNGMwLjEsMTcuMiwxMy40LDEwNS42LDEzLjEsMTE5LjljLTAuMiw5LjMsMTkuMSwxMy42LDE5LjEsMTMuNiIvPg0KCTxwYXRoIGZpbGw9IiNGRkI1NjQiIGQ9Ik0yMDAuMiw5My4zYzAsMCw5LjcsNTAuMiwxMS42LDQ4LjRjMi0xLjgsMTAuOC03LjksMTAuOC03LjlsLTEzLjUtNDAuNUgyMDAuMnoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGQkU4IiBkPSJNMTg0LjEsMTIzLjZjMCwwLTEyLjksMjQuNi0xMC45LDIyLjhjMi0xLjgsMjctMi40LDI3LTIuNEwxODQuMSwxMjMuNnoiLz4NCgk8cGF0aCBmaWxsPSIjRjI1RjY4IiBkPSJNMjU3LjksOTIuOGMtMS41LDItMyw0LjEtNC40LDYuM2MtMS4yLDEuOS0yLjksMi4zLTQuNiwxLjljLTEuNywzLjQtMy41LDYuNy01LjcsOS44DQoJCWMtNi4yLDIyLjQtMC43LDQxLjctOC43LDYzLjhjLTEuMywzLjUsMC4zLDAuMywyLjIsMi41YzUuNi0zLDMxLjEsMy41LDM4LjcsNC4yYzEuNy0yLjMtOS4xLTMuMy0xMC4zLTYuNmMxLjQsMy45LDAuMi01LjIsMC4yLTYuMQ0KCQljMC4zLTIuNiwwLTUuNSwwLjMtOC4xYzAuNy00LjYtMS40LTYuNC0wLjgtMTFjMS45LTE0LjUsMy40LTI5LjQsMy00NC4xYy0yLjItMy45LTQuMS03LjktNS42LTEyLjENCgkJQzI2MSw5Mi45LDI1OS40LDkyLjcsMjU3LjksOTIuOHoiLz4NCjwvZz4NCjxnIGlkPSJMYXllcl8yIj4NCgkNCgkJPHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0FGM0E0NiIgc3Ryb2tlLXdpZHRoPSI0Ljk3NjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSINCgkJMjM4LDE3MS4xIDI0NS4yLDEwOSAyNjAuNCw4Ni45IDI2Ny43LDExMC44IDI2NS4xLDE3NC44IAkiLz4NCgkNCgkJPHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0FGM0E0NiIgc3Ryb2tlLXdpZHRoPSI0Ljk3NjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgcG9pbnRzPSINCgkJMTgwLjIsMTgyLjQgMTczLjgsMTQ0IDE4NC4xLDEyMy42IDIwMC4xLDEzOS4yIDIwNi42LDE3Ni4yIAkiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuOTc2MyIgc3Ryb2tlLWxpbmVjYXA9InNxdWFyZSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSINCgkJTTIxOC4yLDE3NC44YzAsMC00LjUtMTYuNS05LTM2LjRjLTQuOC0yMS4zLTkuNy00My44LTktNDUuMWMxLjMtMi42LDUuNC00LjgsOC45LDBjMiwyLjcsNy45LDIxLjYsMTMuNSw0MC41DQoJCWM2LjMsMjEuMSwxMi4yLDQyLjMsMTEuOSw0MC44Ii8+DQoJPHBhdGggZmlsbD0iI0FGM0E0NiIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjIuNDg4MiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMjAwLjIsOTMuM2MtMTEuNi0xMi4yLTEwLjQtMTkuMi02LjYtMjMNCgkJYzYuNi02LjYtMi44LTE2LjYtMC45LTE2LjhjNi42LTAuNiwyOC42LDkuNiwxNy4zLDM2LjkiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuOTc2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ig0KCQlNMjQ1LjIsMTA5YzAsMCwxMS4zLTQuOCwyMi41LDEuOSIvPg0KCQ0KCQk8cGF0aCBmaWxsPSIjRkZGQkU4IiBzdHJva2U9IiNBRjNBNDYiIHN0cm9rZS13aWR0aD0iNC45NzYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iDQoJCU0yMDAuMSwxMzkuMmMwLDQuNy0xMi4yLDQuNy0xMi4yLDQuN2MtMy4yLDUuMy0xNC4xLDAtMTQuMSwwIi8+DQoJPHBhdGggZmlsbD0iI0FGM0E0NiIgZD0iTTE5MC45LDEzMC4zYzMuNCwzLjMtMTIsMy41LTEyLDMuNWw1LjEtMTAuMkwxOTAuOSwxMzAuM3oiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuOTc2MyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ig0KCQlNMjExLjgsMTQxLjZjNy43LDAsMTEuNC02LDExLjQtNiIvPg0KCQ0KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBRjNBNDYiIHN0cm9rZS13aWR0aD0iNC45NzYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iDQoJCU0xNjksMTg4LjhMMTY5LDE4OC44YzQzLjktMjEuNSw5NC4zLTE2LjYsMTE5LjgtMS4xTDI3NywzMjEuOWMwLDAtMzkuOSwyMy4yLTk1LjItMS4xTDE2OSwxODguOHoiLz4NCgkNCgkJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjQuODIyOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ig0KCQlNMjU1LjcsMjcwLjRsLTIuMi0zMi42bC0yNC40LTE4LjlMMjA1LDIzNi42YzAuMywxMS44LDEuNCwyMi44LDEuNywzNC42QzIwNi42LDI3MS4yLDIzNiwyNzUuOSwyNTUuNywyNzAuNHoiLz4NCgkNCgkJPGxpbmUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjQUYzQTQ2IiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiB4MT0iMjI5LjUiIHkxPSIyMTkiIHgyPSIyMjkuNSIgeTI9IjI0NiIvPg0KCQ0KCQk8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBRjNBNDYiIHN0cm9rZS13aWR0aD0iMy44NTgyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iDQoJCU0yMzMuMiwyNDAuOGMtMS41LDAtMi45LDAuMy02LjgsMC40YzAsMC0xLTAuOS0wLjEsNS45YzIuOSwwLjEsNCwwLjIsNi45LDAuMkMyMzMuMiwyNDcuNCwyMzMuMiwyNDIuNSwyMzMuMiwyNDAuOHoiLz4NCjwvZz4NCjwvc3ZnPg0K';

    constructor(private productsService: ProductsService, private router: Router, private manageProducts: ManageProducts, private cartService : CartService,
        private binDataMatnrSetService: BinDataMatnrSetService, public sanitizer: DomSanitizer, private sectionMaterial: SectionMaterial,
        private carrelloService : CarrelloService, private accountService: AccountService, private fb: FormBuilder) {
    }
    
    public addProductForm: FormGroup;

    ngOnInit(): void {
        this.addProductForm = this.fb.group({});

        if (environment && environment.oData) {
            // Carico l'immagine
            if (this.item.picId) {
                this.binDataMatnrSetService.getImage(this.item.code,this.item.picId).subscribe((resp : any) => {
                    if (resp.body && resp.body.d && resp.body.d) {
                        if (resp.body.d.Filename) {
                            const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                            // let objectURL = 'data:image/jpeg;base64,' + resp.body.d.BinDoc;
                            if (fileName && fileName === 'jpg' || fileName === 'png') {
                                let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                            } else if (fileName && fileName === 'svg') {
                                this.svgThumbnail= resp.body.d.BinDoc;
                            } else {
                                console.log('no fileName');
                            }                         
                        }
                    }
                });
            }
            
            this.sectionMaterial.getSectionMaterial(this.item.code).subscribe((resp:any) => {
                this.items = [];
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(m => {
                        if (m) {
                            const product = Materiale.fromJSON(m);
                            if (product.picId) {
                                this.binDataMatnrSetService.getImage(product.code,product.picId).subscribe((resp : any) => {
                                    if (resp.body && resp.body.d && resp.body.d) {
                                        if (resp.body.d.Filename) {
                                            const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                                            // let objectURL = 'data:image/jpeg;base64,' + resp.body.d.BinDoc;
                                            if (fileName && fileName === 'jpg' || fileName === 'png') {
                                                let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                                product.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                            } else if (fileName && fileName === 'svg') {
                                                let objectURL = 'data:image/svg+xml;base64, ' + resp.body.d.BinDoc;
                                                product.thumbnail= this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
                                            } else {
                                                console.log('no fileName for product:' + product.code);
                                            }                         
                                        }
                                    }
                                    this.items.push(product);
                                });
                            } else {
                                this.items.push(product);
                            }
                            this.addProductForm.addControl(product.code,new FormControl(0, Validators.required));

                            this.cartService.getCart().orders.forEach(o => {
                                if (o && o.product && o.product.code === product.code) {
                                    this.setQtyValue(o.product.code, o.quantity);
                                }
                            });
                        }
                    });
                }
            })
            
        } else {
            // this.thumbnail = 'assets/img/coffeeMachines/tavola2_bigger.gif';
            this.svgThumbnail = this.svgData;
            this.items = this.productsService.getBoardsProducts();
            this.items.forEach( i => {
                this.addProductForm.addControl(i.code,new FormControl(0, Validators.required));

                this.cartService.getCart().orders.forEach(o => {
                    if (o && o.product && o.product.code === i.code) {
                        this.qty.setValue(o.quantity);
                    }
                });
            });
            if (this.item.code === 'Code 1') {
                this.qty.setValue(10);
            }

        }    
    }

    public close() {
        this.bsModalRef.hide();
        // this.router.navigate(['./home/boards']);
    }

    get qty() {
        return this.addProductForm.get(this.item.code);
    }

    public setQtyValue(code : string, value : number) {
        if (this.addProductForm.get(code)) {
            this.addProductForm.get(code).setValue(value);
        }
    }

    public getQtyValue(code : string) : number {
        if (this.addProductForm.get(code)) {
            return this.addProductForm.get(code).value;
        }
        return 0;
    }

    Id(id: string, code: string): string {
        return id + '_' + code;
    }

    public getPrice(price : number) : string {
        if (price) {
            return price.toFixed(2);
        }
        return '0';
    }

    addProduct(code : string) {

        if (environment && environment.oData) {
            const q = this.getQtyValue(code);
            let productToBeAdded = null;
            this.items.forEach(i => {
                if (i.code === code) {
                    productToBeAdded = i;
                }
            })
            console.log('code:' + code + ',q:' + q);
            this.accountService.fetchToken().subscribe(
                response1 => {
                    if (response1.headers) {
                        const csrftoken : string = response1.headers.get('X-CSRF-Token');
                        if (csrftoken) {
                            if (q === 0) {
                                this.carrelloService.deleteFromCarrello(csrftoken, code).subscribe(d => {
                                    console.log('delete went fine');
                                    this.manageProducts.changeProduct(productToBeAdded,q);
                                },
                                error => {
                                    console.log('error delete:' + error);
                                });
                            } else {
                                const carrello : Carrello = new Carrello();
                                carrello.Matnr = code;
                                carrello.Menge = '' + q;
                                this.carrelloService.updateCart(csrftoken, carrello).subscribe(d => {
                                    console.log('update went fine');
                                    this.manageProducts.changeProduct(productToBeAdded,q);
                                },
                                error => {
                                    console.log('error update:' + error);
                                })
                            }
                            
                        }
                    }
                })
            ;
        } else {
            const q = this.qty.value;
        }
    }

}