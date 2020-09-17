import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Product } from '@app/models/item';
import { Cart } from '@app/models/cart';
import { Order } from '@app/models/order';
import { AccountService } from '@app/services/account.service';
import { CartService } from '@app/services/cart.service';
import { User } from '@app/models/user';
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
import { ProductsService } from '@app/services/products.service';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

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

    @Output() newOrderEmitter = new EventEmitter<Order>();
    @Output() deleteOrderEmitter = new EventEmitter<Order>();

    faTrash = faTrashAlt;
    
    constructor(private accountService : AccountService, private cartService : CartService, private modalService: BsModalService, 
        private router: Router, private manageProducts : ManageProducts, private carrelloService: CarrelloService, 
        private userDataSetService : UserDataSetService, private catalogueService : CatalogueService, private spinner: NgxSpinnerService,
        private translateService : TranslateService, private productsService: ProductsService) {

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
            this.currency = 'EUR';
            /*setTimeout(() => {
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
                this.spinner.hide();
            } , 1);*/
            const items = this.productsService.getAllProducts();
            items.forEach( i => {
                this.products.push(i);
                const order : Order = {
                    id : '1',
                    product : i,
                    quantity : 1
                };
                this.orders.push(order);
                this.totalPrice = this.totalPrice + (i.price  * 1) ;
                this.totalQuantity = this.totalQuantity + 1;
            })
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
                let position = -1;
                let i = 0;
                let orderToBeDeleted = undefined;
                for(i = 0; i< this.orders.length; i++) {
                    const o = this.orders[i];
                    if (o.product.code === row.CodiceProdotto) {
                        position = i;
                        orderToBeDeleted = o;
                    }
                }
                if (position > -1 && orderToBeDeleted) {
                    console.log('deleting order:' + row.CodiceProdotto);
                    this.deleteOrder(orderToBeDeleted);
                }
                if (environment && environment.oData) {
                    console.log('cart2');
                    this.accountService.setUserValueFromUser(user);
                    console.log("reading element: matrn:" + matrn);
                    this.catalogueService.getItem(matrn, user).subscribe(p => {
                        if (p && p.body && p.body.d) {
                            order.product.price = p.body.d.Netpr;
                            order.product.description = p.body.d.Maktx;
                            console.log('order.product.code:' + order.product.code + ',p.body.d.Netpr:' + p.body.d.Netpr + ',order.product.price:' + order.product.price);
                            order.product.currency = p.body.d.Waers;
                            if (this.currency === undefined) {
                                this.currency = order.product.currency;
                            }
                            order.product.meins = p.body.d.Meins;
                            let qty : number = undefined;
                            try {
                                qty = Number(order.quantity);
                            } catch (error) {
                                console.log('onChangeQuantity - error in casting:' + error);
                                order.invalidQuantity = true;
                            }
                            if (qty && order.product.meins && (order.product.meins === 'PZ' || order.product.meins === 'NR')) {
                                if (!Number.isInteger(qty)) {
                                    order.invalidQuantityFormat = true;
                                }
                            }
                            if (order.invalidQuantity || order.invalidQuantityFormat) {
                                order.quantity = 0;
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
                    order.quantity = 2;
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

    public getPrice(price : number) : string {
        if (price) {
            return Number(price).toFixed(2);
        }
        return '0.00';
    }

    public getTotalPrice(productCode : string) : string {
        console.log('getTotalPrice:' + productCode);
        let order = new Order();
        let totalePrice = 0.00;
        this.orders.forEach(o => {
            if (!o.error && !o.invalidQuantity && !o.invalidQuantityFormat && o.product.code === productCode) {
                console.log("checking order:" + productCode);
                order = o;
                totalePrice = Number(order.product.price * order.quantity);
            }
        })
        console.log("return totalPrice:" + totalePrice);
        return totalePrice.toFixed(2);
    }

    public haveOrdersErrors() : boolean {
        let errors = 0;
        this.orders.forEach(o => {
            if (o.invalidQuantity || o.invalidQuantityFormat) {
                errors = errors + 1;
            }
        });
        return (errors != 0);
    }
    onChangeQuantity(productCode: any, value : any) {
        console.log('onChangeQuantity - productCode:' + productCode + ',value:' + value);
        let order : Order = undefined;
        this.orders.forEach(o => {
            if (o.product.code === productCode) {
                order = o;
            }
        })
        order.invalidQuantity = false;
        order.invalidQuantityFormat = false;
        // Non dovebbe mai succedere
        if (order === undefined || order === null) {
            return;
        }
        if (value === '') {
            order.invalidQuantity = true;
            return;
        }
        let qty : number = undefined;
        try {
            qty = Number(value);
        } catch (error) {
            console.log('onChangeQuantity - error in casting:' + error);
            order.invalidQuantity = true;
            return;
        }
        if (qty && order.product.meins && (order.product.meins === 'PZ' || order.product.meins === 'NR')) {
            if (!Number.isInteger(qty)) {
                order.invalidQuantityFormat = true;
                return;
            }
        }
        this.orders.forEach(o => {
            if (o.product.code === productCode) {
                o.invalidQuantity = false;
            }
        })
        if (environment && environment.oData) {
            let order = new Order();
            let i = 0;
            for(i = 0; i< this.orders.length; i++) {
                const o = this.orders[i];
                if (o.product.code === productCode) {
                    order = o;
                }
            }
            console.log('onChangeQuantity - qty:' + qty + ';qty > 0:' + (qty > 0) + '-qty === 0:' + (qty === 0));
            if (qty > 0) { // Update
                this.accountService.fetchToken().subscribe(
                    response1 => {
                        if (response1.headers) {
                            const csrftoken : string = response1.headers.get('X-CSRF-Token');
                                const carrello : Carrello = new Carrello();
                                carrello.Matnr = order.product.code;
                                carrello.Menge = '' + qty;
                                carrello.Meins = order.product.meins;
                                this.carrelloService.updateCart(csrftoken, carrello).subscribe(d => {
                                    console.log('update went fine');
                                    this.manageProducts.changeProduct(order.product,qty);
                                    order.quantity = qty;
                                    this.totalPrice = 0;
                                    this.orders.forEach(o => {
                                        if (o.product.code === productCode) {
                                            console.log('o.product.code === productCode qty:' + qty + ',order.product.price:' + order.product.price);
                                            this.totalPrice = this.totalPrice + qty * order.product.price;
                                            console.log('o.product.code === productCode totalPrice:' + this.totalPrice);
                                        } else {
                                            console.log('o.product.code != productCode o.quantity:' + o.quantity + ',o.product.code:' + o.product.code + ',o.product.price:' + o.product.price);
                                            this.totalPrice = this.totalPrice + o.quantity * o.product.price;
                                            console.log('o.product.code != productCode totalPrice:' + this.totalPrice);
                                        }
                                    });
                                    console.log('update - productCode:' + productCode + ',totalePrice:' + this.totalPrice);
                                    this.strTotalPrice = this.totalPrice.toFixed(2);
                                    this.newOrderEmitter.emit(order);
                                },
                                error => {
                                    console.log('error update:' + error);
                                })
                        }
                        
                    }, error => {
                        console.log('error:' + error);
                    });
            } else if (qty === 0) { // delete
                console.log('qty === 0;productCode:' + productCode);
                this.totalPrice = 0;
                this.orders.forEach(o => {
                    if (o.product.code !== productCode) {
                        console.log('o.product.code !== productCode');
                        this.totalPrice = this.totalPrice + order.quantity * order.product.price;
                    } else {
                        o.quantity = 0;
                    }
                });
                console.log('delete - totalePrice:' + this.totalPrice);
                this.strTotalPrice = this.totalPrice.toFixed(2);
            }
        } else {
            let order = new Order();
            this.orders.forEach(o => {
                if (o.product.code === value) {
                    order = o;
                }
            })
            order.quantity = value;
            this.totalPrice = order.quantity * order.product.price;
            this.newOrderEmitter.emit(order);
        }
    }

    focusOutFunction(productCode: any, value : any) {
        console.log('focusOutFunction productCode:' + productCode + '-value:' + value );
        try {
            if (Number(value).toFixed(0) === '0') {
                this.onDeleteOrder(productCode);
            } 
        } catch (error) {
            console.log('focusOutFunction error ' + error);
        }
    }

    onDeleteOrder(productCode: any) {
        console.log('ondeleteorder - productCode:' + productCode);
        if (environment && environment.oData) {
            let order = new Order();
            let i = 0;
            let position = -1;
            for(i = 0; i< this.orders.length; i++) {
                const o = this.orders[i];
                if (o.product.code === productCode) {
                    order = o;
                    position = i;
                }
            }
            if (position < 0) {
                return;
            }
            console.log('ondeleteorder - order.error:' + order.error);
            if (order.error) {
                this.deleteOrderEmitter.next(order);
                return;
            }
            this.accountService.fetchToken().subscribe(
                response1 => {
                    if (response1.headers) {
                        const csrftoken : string = response1.headers.get('X-CSRF-Token');
                        this.carrelloService.deleteFromCarrello(csrftoken, order.product.code).subscribe(d => {
                            console.log('delete went fine');
                            this.manageProducts.changeProduct(order.product,0);
                            order.quantity = 0;
                            this.totalPrice = 0;
                            console.log('delete i:' + position);
                            const deletedElement = this.orders.splice(position, 1);
                            console.log('deleted element:' + +deletedElement.length + ',' + deletedElement[0].product.code);
                            console.log('this.orders:' + this.orders.length);
                            this.orders.forEach(o => {
                                this.totalPrice = this.totalPrice + o.quantity * order.product.price;
                            });
                            this.strTotalPrice = this.totalPrice.toFixed(2);
                            this.deleteOrderEmitter.next(order);
                        },
                        error => {
                            console.log('error delete:' + error);
                        });
                    }
                });
        }
        
        
    }
}