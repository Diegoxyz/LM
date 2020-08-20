import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { Product } from '@app/models/item';
import { Cart } from '@app/models/cart';
import { Order } from '@app/models/order';
import { AccountService } from '@app/services/account.service';
import { CartService } from '@app/services/cart.service';
import { User } from '@app/models/user';
import { Customer } from '@app/models/customer';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { UserDataSetService } from '@app/models/OData/UserDataSet/userdataset.service';
import { CarrelloService } from '@app/services/carrello.service';
import { HandledProduct } from './services/handled-product';
import { ManageProducts } from './services/manage-products.service';
import { CatalogueService } from '@app/services/catalogue.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
import { Carrello } from '@app/models/carrello';

@Component({selector: 'app-cart',
templateUrl: './cart.component.html',
styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

    cart : Cart;

    orders : Order[] =[];

    products : Product[] =[];
    
    totalPrice : number = 0;
    totalQuantity : number = 0;
    strTotalPrice : string = '0.00';
    bsModalRef: BsModalRef;

    config = {
        backdrop: true,
        ignoreBackdropClick: false,
        class: "modal-lg"
    };

    currency : string = undefined;

    loadingCartError = false;
    loadingCartErrorMessage = false;
    loadingFromFile = false;

    @ViewChild('loadFromFile')
    loadFromFile: ElementRef;

    constructor(private accountService : AccountService, private cartService : CartService, private modalService: BsModalService, 
        private router: Router, private manageProducts : ManageProducts, private carrelloService: CarrelloService, 
        private userDataSetService : UserDataSetService, private catalogueService : CatalogueService, private spinner: NgxSpinnerService,
        private translateService : TranslateService) {

    }
    ngOnInit(): void {
        const user : User = this.accountService.userValue;
        console.log('showing spinner');
        
        if (!this.accountService.isSessionStillValid()) {
            this.accountService.logout();
            setTimeout(
              () => this.router.navigate(['/account/login']),
              100
            );
          }
        if (environment && environment.oData && this.accountService.user !== undefined && this.accountService.user !== null) {
            this.translateService.onLangChange.subscribe(l => {
                console.log('cart changed language');
                this.loadData();
            });
            this.loadData();
              
        } else {
            
            setTimeout(() => {
                const customer : Customer = {
                    firstName : user.username,
                    lastName : user.username,
                    fiscalCode : 'DCB70F21L736A',
                };
                this.cart = this.cartService.getCart(customer);
                this.orders = this.cart.orders;
                this.orders.forEach(o => {
                    if (o.product) {
                        this.products.push(o.product);
                        this.totalPrice = this.totalPrice + (o.product.price  * o.quantity) ;
                    }
                    this.totalQuantity = this.totalQuantity + o.quantity;
                });
                this.currency = 'EUR';
                this.spinner.hide();
            } , 2000);
        }

        this.strTotalPrice = this.totalPrice.toFixed(2);
        this.manageProducts.manageProducts$.subscribe((h : HandledProduct) => {
            this.cart = this.cartService.addAnOrder(h.product, h.quantity);
        });
    
        
    }
    ngOnDestroy(): void {
        
    }

    loadData(): void {
        this.spinner.show();
        this.carrelloService.getCart().subscribe(resp => {
            console.log('cart.component - this.carrelloService.getCart -' + resp);
            if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                this.cart = Cart.fromCarrello(resp.body.d.results, this.userDataSetService.userDataSetValue);
                this.cartService.setCart(this.cart);
                this.orders = this.cart.orders;
                console.log('cart- this.orders.length:' + this.orders.length);
                if (this.orders === undefined || this.orders.length === 0) {
                    this.spinner.hide();
                }
                let i = 0;
                this.orders.forEach(o => {
                    i++;
                    if (o.product) {
                        console.log('cart3');
                        this.catalogueService.getItem(o.product.code).subscribe(p => {
                            if (p && p.body && p.body.d) {
                                o.product.price = p.body.d.Netpr;
                                console.log('o.product.code:' + o.product.code + ',p.body.d.Netpr:' + p.body.d.Netpr + ',o.product.price:' + o.product.price);
                                o.product.currency = p.body.d.Waers;
                                if (this.currency === undefined) {
                                    this.currency = o.product.currency;
                                }
                                this.products.push(o.product);
                                this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                                this.totalQuantity = this.totalQuantity + o.quantity;
                                this.strTotalPrice = this.totalPrice.toFixed(2);
                            }
                            if (this.orders === undefined || i === this.orders.length) {
                                this.spinner.hide();
                            }
                        });
                        
                    }
                    
                });
            } else {
                this.spinner.hide();
            }
            
            });
    }
    emptyCart(): void {
        console.log('empty cart');
        this.spinner.show();
        if (environment && environment.oData) {
            let i = 0;
            const length = this.orders.length;
            this.orders.forEach(order => {
                i++;
                this.accountService.fetchToken().subscribe(
                    response1 => {
                        if (response1.headers) {
                            const csrftoken : string = response1.headers.get('X-CSRF-Token');
                            this.carrelloService.deleteFromCarrello(csrftoken, order.product.code).subscribe(d => {
                                console.log('delete went fine');
                                this.deleteOrder(order, (i === length));
                            },
                            error => {
                                console.log('error delete:' + error);
                                this.spinner.hide();
                            });
                        }
                    });
                });
            
        } else {
            this.cartService.emptyCart();
            this.orders = [];
            this.totalQuantity = 0;
            this.totalPrice = 0;
            this.strTotalPrice = '0.00';
        }
        if (this.orders === undefined || this.orders.length === 0) {
            this.spinner.hide();
        }
    }

    submitOrder(template: TemplateRef<any>): void {
        // this.bsModalRef = this.modalService.show(template, this.config);
        this.goToShipToSet();
    }

    updateOrders(newOrder) {
        console.log('update orders');
        if (newOrder) {
            this.totalQuantity = 0;
            this.totalPrice = 0;
            this.strTotalPrice = '0.00';
            this.orders.forEach(o => {
                if (o.id === newOrder.id) {
                    this.totalPrice = this.totalPrice + (newOrder.product.price * newOrder.quantity);
                    this.totalQuantity = this.totalQuantity + newOrder.quantity;
                } else {
                    this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                    this.totalQuantity = this.totalQuantity + o.quantity;
                }
            });
            this.cartService.setOrders(this.orders);
            this.strTotalPrice = this.totalPrice.toFixed(2);
        }
    }

    deleteOrder(order, disableSpinner?: boolean) {
        console.log('delete order');
        if (order) {
            this.manageProducts.changeProduct(order.product,0);
            const tempOrders : Order[] = new Array<Order>();
            this.totalQuantity = 0;
            this.totalPrice = 0;
            this.orders.forEach( o => {
                if ((o.id && order.id && o.id !== order.id) || (o.product && order.product && o.product.code !== order.product.code )) {
                    tempOrders.push(o);
                    this.totalPrice = this.totalPrice + (o.product.price * o.quantity);
                    this.totalQuantity = this.totalQuantity + o.quantity;
                }
            });
            this.orders = tempOrders;
            this.cartService.setOrders(this.orders);
            this.strTotalPrice = this.totalPrice.toFixed(2);
        }
        if (disableSpinner) {
            this.spinner.hide();
        }
    }

    removeSelected() {
        
    }

    goToShipToSet(){
        this.router.navigate(['./home/cart/ship-to-set']);
        
    }

    reset() {
        this.loadingCartError = false;
        this.loadingCartErrorMessage = undefined;
        this.loadFromFile.nativeElement.value = '';
        this.loadingFromFile = false;
    }

    onFileChange(ev) {
        this.loadingCartError = false;
        this.loadingCartErrorMessage = undefined;
        this.loadingFromFile = true;
        if (!this.cartService.isCartEmpty()) {
            this.loadingCartError = true;
            this.loadingCartErrorMessage = this.translateService.instant('cartIsNotEmpty');
            return;
        }
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];
        this.spinner.show();
        reader.onload = (event) => {
          const data = reader.result;
          try{
            workBook = XLSX.read(data, { type: 'binary' });
          } catch (error) {
                console.error('Error during import excel file:' + error);
                this.loadingCartError = true;
                this.loadingCartErrorMessage = this.translateService.instant('wrongCartFileFormat');
                this.spinner.hide();
                return;
          }
          if (this.cart === undefined) {
            this.cart = {
                customer : {
                    lastName : '',
                    firstName : '',
                    fiscalCode : ''
                },
                orders : []
            }
          }
          const user : User = this.accountService.userValue;
          jsonData = workBook.SheetNames.reduce((initial, name) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);
            initial[name].forEach(row => {
                if (row.CodiceProdotto === undefined || row.Pezzi === undefined) {
                    this.loadingCartError = true;
                    this.loadingCartErrorMessage = this.translateService.instant('wrongCartFileFormat');
                    this.spinner.hide();
                    return;
                }
                const matrn : string = '' + row.CodiceProdotto;
                const order : Order = new Order();
                const newProduct : Product = new Product(matrn,'',0,'EUR',false,'','','','');
                order.product = newProduct;
                order.quantity = row.Pezzi;
                if (environment && environment.oData) {
                    console.log('cart2');
                    this.accountService.setUserValueFromUser(user);
                    this.catalogueService.getItem(matrn, user).subscribe(p => {
                        if (p && p.body && p.body.d) {
                            order.product.price = p.body.d.Netpr;
                            order.product.description = p.body.d.Maktx;
                            console.log('order.product.code:' + order.product.code + ',p.body.d.Netpr:' + p.body.d.Netpr + ',order.product.price:' + order.product.price);
                            order.product.currency = p.body.d.Waers;
                            if (this.currency === undefined) {
                                this.currency = order.product.currency;
                            }
                            this.accountService.fetchToken().subscribe(
                                response1 => {
                                    if (response1.headers) {
                                        const csrftoken : string = response1.headers.get('X-CSRF-Token');
                                        if (csrftoken) {
                                            const carrello : Carrello = new Carrello();
                                            carrello.Matnr = matrn;
                                            carrello.Menge = '' + order.quantity;
                                            this.accountService.setUserValueFromUser(user);
                                            this.carrelloService.updateCart(csrftoken, carrello).subscribe(d => {
                                                console.log(' loading from excel update went fine');
                                                const sapMessage = d.headers.get('sap-message');
                                                console.log('sapMessage:' + sapMessage);
                                                if (sapMessage !== undefined && sapMessage !== null) {
                                                    let errorMessage = this.translateService.instant('unknownError');
                                                    try {
                                                        let sm = JSON.parse(sapMessage);
                                                        errorMessage = sm.message;
                                                    } catch (error) {
                                                        const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
                                                        if (docSapMessage.hasChildNodes()) {
                                                            if (docSapMessage.firstChild.childNodes.length >= 2) {
                                                                errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                                                            }
                                                        }
                                                    }
                                                    order.error = errorMessage;
                                                    console.log('order.error:' + order.error);
                                                }
                                                console.log('user after checking for sapmessage:' + this.accountService.userValue + ',' + this.accountService.user);
                                                this.products.push(order.product);
                                                this.manageProducts.changeProduct(order.product,order.quantity);
                                                this.totalPrice = this.totalPrice + (order.product.price * order.quantity);
                                                this.totalQuantity = this.totalQuantity + order.quantity;
                                                this.strTotalPrice = this.totalPrice.toFixed(2);
                                                this.orders.push(order);
                                                this.cart.orders = this.orders;
                                            },
                                            error => {
                                                console.log('error update:' + error);
                                                order.error = error;
                                                this.products.push(order.product);
                                                this.manageProducts.changeProduct(order.product,order.quantity);
                                                this.totalPrice = this.totalPrice + (order.product.price * order.quantity);
                                                this.totalQuantity = this.totalQuantity + order.quantity;
                                                this.strTotalPrice = this.totalPrice.toFixed(2);
                                                this.orders.push(order);
                                                this.cart.orders = this.orders;
                                            })
                                        }
                                    }
                                }
                            )
                        }
                        
                    });
                } else {
                    order.product.price = 1;
                    order.product.currency = 'EUR';
                    if (this.currency === undefined) {
                        this.currency = order.product.currency;
                    }
                    this.products.push(order.product);
                    this.totalPrice = this.totalPrice + (order.product.price * order.quantity);
                    this.totalQuantity = this.totalQuantity + order.quantity;
                    this.strTotalPrice = this.totalPrice.toFixed(2);
                    this.orders.push(order);
                    this.cart.orders = this.orders;
                }
            });
            // aggiungi chiamata al servizio chiamata per item
            return initial;
          }, {});
          // const dataString = JSON.stringify(jsonData);
          // document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
        }
        reader.readAsBinaryString(file);
        this.spinner.hide();
    }

    /*setDownload(data) {
        setTimeout(() => {
          const el = document.querySelector("#download");
          el.setAttribute("href", `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
          el.setAttribute("download", 'xlsxtojson.json');
        }, 1000)
    }*/
}