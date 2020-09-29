import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, ElementRef, Output, EventEmitter, SecurityContext } from '@angular/core';
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
import { faCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { BinDataMatnrSetService } from '@app/models/OData/BinDataMatnrSet/bindatamatnrset.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Materiale } from '@app/models/OData/MacchineSet/macchineset.entity';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

    cart: Cart;

    orders: Order[] = [];

    products: Product[] = [];

    totalPrice: number = 0;
    totalQuantity: number = 0;
    strTotalPrice: string = '0.00';
    bsModalRef: BsModalRef;
    bsModalRefInfo: NgbModalRef;

    config = {
        backdrop: true,
        ignoreBackdropClick: false,
        class: "modal-lg"
    };

    currency: string = undefined;

    loadingCartError = false;
    loadingCartErrorMessage = false;
    loadingFromFile = false;

    @ViewChild('loadFromFile')
    loadFromFile: ElementRef;

    @Output() newOrderEmitter = new EventEmitter<Order>();
    @Output() deleteOrderEmitter = new EventEmitter<Order>();

    faTrash = faTrashAlt;
    faInfoCircle=faInfoCircle;
    faCircle=faCircle;

    itemDetail : Product;
    displayNoImageDetail : boolean = true;
    firstSrcDetail? : string;
    secondSrcDetail? : string;
    thirdSrcDetail? : string;
    fourthSrcDetail? : string;
    fifthSrcDetail? : string;
    thumbnail: any = '';
    svgThumbnail: any = '';

    private readonly notifier: NotifierService;

    constructor(private accountService: AccountService, private cartService: CartService, private modalService: BsModalService,
        private modalServiceInfo: NgbModal,
        private router: Router, private manageProducts: ManageProducts, private carrelloService: CarrelloService,
        private userDataSetService: UserDataSetService, private catalogueService: CatalogueService, private spinner: NgxSpinnerService,
        private translateService: TranslateService, private productsService: ProductsService, 
        private binDataMatnrSetService: BinDataMatnrSetService, public sanitizer: DomSanitizer, private notifierService: NotifierService) {
            this.notifier = notifierService;
    }
    ngOnInit(): void {
        const user: User = this.accountService.userValue;
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
            items.forEach(i => {
                this.products.push(i);
                const order: Order = {
                    id: '1',
                    product: i,
                    quantity: 1
                };
                this.orders.push(order);
                this.totalPrice = this.totalPrice + (i.price * 1);
                this.totalQuantity = this.totalQuantity + 1;
            })
        }

        this.strTotalPrice = this.totalPrice.toFixed(2);
        this.manageProducts.manageProducts$.subscribe((h: HandledProduct) => {
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
            this.accountService.checkSession().subscribe(resp => {
                if (resp && resp.body && resp.body.d && resp.body.d.SessionValid && resp.body.d.SessionValid === 'X') {
                    let i = 0;
                    const length = this.orders.length;
                    this.orders.forEach(order => {
                        i++;
                        this.accountService.fetchToken().subscribe(
                            response1 => {
                                if (response1.headers) {
                                    const csrftoken: string = response1.headers.get('X-CSRF-Token');
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
                    console.log('cart session invalid');
                    this.accountService.logout();
                    this.router.navigate(['/account/login', { sessionEnded: 'sessionEnded' }]);
                }
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
            this.manageProducts.changeProduct(order.product, 0);
            const tempOrders: Order[] = new Array<Order>();
            this.totalQuantity = 0;
            this.totalPrice = 0;
            this.orders.forEach(o => {
                if ((o.id && order.id && o.id !== order.id) || (o.product && order.product && o.product.code !== order.product.code)) {
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

    goToShipToSet() {
        this.router.navigate(['./home/cart/ship-to-set']);

    }

    reset() {
        this.loadingCartError = false;
        this.loadingCartErrorMessage = undefined;
        this.loadFromFile.nativeElement.value = '';
        this.loadingFromFile = false;
    }

    onFileChange(ev) {
        /*this.accountService.checkSession().subscribe(resp => {
            if (resp && resp.body && resp.body.d && resp.body.d.SessionValid && resp.body.d.SessionValid === 'X') {
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
                    try {
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
                            customer: {
                                lastName: '',
                                firstName: '',
                                fiscalCode: ''
                            },
                            orders: []
                        }
                    }
                    const user: User = this.accountService.userValue;
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
                            const matrn: string = '' + row.CodiceProdotto ? row.CodiceProdotto.toUpperCase() : null;
                            const order: Order = new Order();
                            const newProduct: Product = new Product(matrn, '', 0, 'EUR', false, '', '', '', '');
                            order.product = newProduct;
                            order.quantity = row.Pezzi;
                            let position = -1;
                            let i = 0;
                            let orderToBeDeleted = undefined;
                            for (i = 0; i < this.orders.length; i++) {
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
                                        let qty: number = undefined;
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
                                                    const csrftoken: string = response1.headers.get('X-CSRF-Token');
                                                    if (csrftoken) {
                                                        const carrello: Carrello = new Carrello();
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
                                                                    const docSapMessage: Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
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
                                                            this.manageProducts.changeProduct(order.product, order.quantity);
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
                                                                this.manageProducts.changeProduct(order.product, order.quantity);
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
            } else {
                console.log('cart file change session invalid');
                this.accountService.logout();
                this.router.navigate(['/account/login', { sessionEnded: 'sessionEnded' }]);
            }
        });*/
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
                try {
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
                        customer: {
                            lastName: '',
                            firstName: '',
                            fiscalCode: ''
                        },
                        orders: []
                    }
                }
                const user: User = this.accountService.userValue;
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
                        const matrn: string = '' + row.CodiceProdotto ? ('' + row.CodiceProdotto).toUpperCase() : null;
                        const order: Order = new Order();
                        const newProduct: Product = new Product(matrn, '', 0, 'EUR', false, '', '', '', '');
                        order.product = newProduct;
                        order.quantity = row.Pezzi;
                        let position = -1;
                        let i = 0;
                        let orderToBeDeleted = undefined;
                        for (i = 0; i < this.orders.length; i++) {
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
                                    let qty: number = undefined;
                                    try {
                                        qty = Number(order.quantity);
                                    } catch (error) {
                                        console.log('onChangeQuantity - error in casting:' + error);
                                        order.invalidQuantity = true;
                                    }
                                    console.log('importing excel: qty:' + qty + ',order.product.meins:' + order.product.meins);
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
                                                const csrftoken: string = response1.headers.get('X-CSRF-Token');
                                                if (csrftoken) {
                                                    const carrello: Carrello = new Carrello();
                                                    carrello.Matnr = matrn;
                                                    carrello.Menge = '' + order.quantity;
                                                    carrello.Meins = order.product.meins;
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
                                                                const docSapMessage: Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
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
                                                        this.manageProducts.changeProduct(order.product, order.quantity);
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
                                                            this.manageProducts.changeProduct(order.product, order.quantity);
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

    public getPrice(price: number): string {
        if (price) {
            return Number(price).toFixed(2);
        }
        return '0.00';
    }

    public getTotalPrice(productCode: string): string {
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

    public haveOrdersErrors(): boolean {
        let errors = 0;
        this.orders.forEach(o => {
            if (o.invalidQuantity || o.invalidQuantityFormat) {
                errors = errors + 1;
            }
        });
        return (errors != 0);
    }
    onChangeQuantity(productCode: any, value: any) {
        this.accountService.checkSession().subscribe(resp => {
            if (resp && resp.body && resp.body.d && resp.body.d.SessionValid && resp.body.d.SessionValid === 'X') {
                console.log('onChangeQuantity - productCode:' + productCode + ',value:' + value);
                let order: Order = undefined;
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
                let qty: number = undefined;
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
                    for (i = 0; i < this.orders.length; i++) {
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
                                    const csrftoken: string = response1.headers.get('X-CSRF-Token');
                                    const carrello: Carrello = new Carrello();
                                    carrello.Matnr = order.product.code;
                                    carrello.Menge = '' + qty;
                                    carrello.Meins = order.product.meins;
                                    this.carrelloService.updateCart(csrftoken, carrello).subscribe(d => {
                                        console.log('update went fine');
                                        this.manageProducts.changeProduct(order.product, qty);
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
                                        const msg = this.translateService.instant('addedProduct');
                                        this.notifier.hideOldest();
                                        this.notifier.notify('info', msg);
                                    },
                                        error => {
                                            console.log('error update:' + error);
                                            const msg = this.translateService.instant('operationError');
                                            this.notifier.hideOldest();
                                            this.notifier.notify('error', msg);
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
                        const msg = this.translateService.instant('addedProduct');
                        this.notifier.hideOldest();
                        this.notifier.notify('info', msg);
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
            } else {
                console.log('cart change quantity session invalid');
                this.accountService.logout();
                this.router.navigate(['/account/login', { sessionEnded: 'sessionEnded' }]);
            }
        });
    }

    focusOutFunction(productCode: any, value: any) {
        console.log('focusOutFunction productCode:' + productCode + '-value:' + value);
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
            for (i = 0; i < this.orders.length; i++) {
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
                const deletedElement = this.orders.splice(position, 1);
                console.log('deleted element:' + +deletedElement.length + ',' + deletedElement[0].product.code);
                this.deleteOrderEmitter.next(order);
                return;
            }
            this.accountService.fetchToken().subscribe(
                response1 => {
                    if (response1.headers) {
                        const csrftoken: string = response1.headers.get('X-CSRF-Token');
                        this.carrelloService.deleteFromCarrello(csrftoken, order.product.code).subscribe(d => {
                            console.log('delete went fine');
                            this.manageProducts.changeProduct(order.product, 0);
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

    public openModal(template : any, productCode : any) {
        if (template) {
            if (environment && environment.oData) {
                this.catalogueService.getItem(productCode).subscribe(resp => {
                    if (resp.body && resp.body.d && resp.body.d) {
                        const p = resp.body.d;
                        const product = Materiale.fromJSON(p);
                        console.log('maxQuantity:' + product.maxQuantity + ', minQuantity:' + product.minQuantity);
                        product.maxQuantity = product.maxQuantity && product.maxQuantity > 0 ? product.maxQuantity : undefined;
                        product.minQuantity = product.minQuantity && product.minQuantity > 0 ? product.minQuantity : undefined;
                        console.log('maxQuantity2:' + product.maxQuantity + ', minQuantity2:' + product.minQuantity);
                        this.itemDetail = product;
                        console.log('maxQuantity3:' + this.itemDetail.maxQuantity + ', minQuantity3:' + this.itemDetail.minQuantity);
                        this.itemDetail.maxQuantity = this.itemDetail.maxQuantity && this.itemDetail.maxQuantity > 0 ? this.itemDetail.maxQuantity : undefined;
                        this.itemDetail.minQuantity = this.itemDetail.minQuantity && this.itemDetail.minQuantity > 0 ? this.itemDetail.minQuantity : undefined;
                        console.log('maxQuantity4:' + this.itemDetail.maxQuantity + ', minQuantity4:' + this.itemDetail.minQuantity);

                        if (product.picId) {
                            console.log('found picId');
                            this.binDataMatnrSetService.getImage(product.code,product.picId).subscribe((resp : any) => {
                                if (resp.body && resp.body.d && resp.body.d) {
                                    if (resp.body.d.Filename) {
                                        const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                                        if (fileName && (fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png' || fileName.toLowerCase() === 'jpeg') ) {
                                            console.log('loading image with filename:' + fileName);
                                            let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/'+fileName+';base64,' + resp.body.d.BinDoc);
                                            this.firstSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        } else if (fileName && fileName.toLowerCase() === 'svg') {
                                            this.svgThumbnail= resp.body.d.BinDoc;
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
                                            this.firstSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        } else {
                                            console.log('catalogue - no fileName or not recognized:' + fileName);
                                            this.displayNoImageDetail = true;
                                        }                         
                                    }
                                }
                                window.dispatchEvent(new Event('resize'));
                            });
                        }
                        if (product.picId1) {
                            console.log('found picId1');
                            this.binDataMatnrSetService.getImage(product.code,product.picId1).subscribe((resp : any) => {
                                if (resp.body && resp.body.d && resp.body.d) {
                                    if (resp.body.d.Filename) {
                                        const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                                        if (fileName && (fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png' || fileName.toLowerCase() === 'jpeg')) {
                                            console.log('loading image with filename:' + fileName);
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/'+fileName+';base64,' + resp.body.d.BinDoc);
                                            console.log('src2:' + src);
                                            this.secondSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            console.log('secondSrcDetail:' + this.secondSrcDetail);
                                            this.displayNoImageDetail = false;
                                        } else if (fileName && fileName.toLowerCase() === 'svg') {
                                            this.svgThumbnail= resp.body.d.BinDoc;
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
                                            this.secondSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        }                      
                                    }
                                }
                                window.dispatchEvent(new Event('resize'));
                            });
                        }
                        if (product.picId2) {
                            console.log('found picId2');
                            this.binDataMatnrSetService.getImage(product.code,product.picId2).subscribe((resp : any) => {
                                if (resp.body && resp.body.d && resp.body.d) {
                                    if (resp.body.d.Filename) {
                                        const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                                        if (fileName && (fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png' || fileName.toLowerCase() === 'jpeg')) {
                                            console.log('loading image with filename:' + fileName);
                                            let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/'+fileName+';base64,' + resp.body.d.BinDoc);
                                            this.thirdSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        } else if (fileName && fileName.toLowerCase() === 'svg') {
                                            this.svgThumbnail= resp.body.d.BinDoc;
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
                                            this.thirdSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        }
                                    window.dispatchEvent(new Event('resize'));
                                }
                                }
                                
                            });
                        }
                        if (product.picId3) {
                            console.log('found picId3');
                            this.binDataMatnrSetService.getImage(product.code,product.picId3).subscribe((resp : any) => {
                                if (resp.body && resp.body.d && resp.body.d) {
                                    if (resp.body.d.Filename) {
                                        const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                                        if (fileName && (fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png' || fileName.toLowerCase() === 'jpeg')) {
                                            console.log('loading image with filename:' + fileName);
                                            let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/'+fileName+';base64,' + resp.body.d.BinDoc);
                                            this.fourthSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        } else if (fileName && fileName.toLowerCase() === 'svg') {
                                            this.svgThumbnail= resp.body.d.BinDoc;
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
                                            this.fourthSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        }                        
                                    }
                                }
                                window.dispatchEvent(new Event('resize'));
                            });
                        }
                        if (product.picId4) {
                            console.log('found picId4');
                            this.binDataMatnrSetService.getImage(product.code,product.picId4).subscribe((resp : any) => {
                                if (resp.body && resp.body.d && resp.body.d) {
                                    if (resp.body.d.Filename) {
                                        const fileName = resp.body.d.Filename && resp.body.d.Filename.substring(resp.body.d.Filename.lastIndexOf('.') + 1);
                                        if (fileName && (fileName.toLowerCase() === 'jpg' || fileName.toLowerCase() === 'png' || fileName.toLowerCase() === 'jpeg')) {
                                            console.log('loading image with filename:' + fileName);
                                            let objectURL = 'data:image/'+fileName+';base64,' + resp.body.d.BinDoc;
                                            this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/'+fileName+';base64,' + resp.body.d.BinDoc);
                                            this.fifthSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        } else if (fileName && fileName.toLowerCase() === 'svg') {
                                            this.svgThumbnail= resp.body.d.BinDoc;
                                            const src : SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64, '+ this.svgThumbnail);
                                            this.fifthSrcDetail = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,src);
                                            this.displayNoImageDetail = false;
                                        }                       
                                    }
                                }
                                window.dispatchEvent(new Event('resize'));
                            });
                        }
                        this.bsModalRefInfo = this.modalServiceInfo.open(template, { size: 'xl' });
                    }
                    
                });
            } else {
                this.itemDetail = new Product(productCode,'description',10,'EUR',true,'prodh','prodhx','pref','meins');
                this.displayNoImageDetail = false;
                this.firstSrcDetail = 'assets/img/items/No_Image_available.png';
                this.secondSrcDetail = 'assets/img/items/No_Image_available.png';
                this.bsModalRefInfo = this.modalServiceInfo.open(template, { size: 'xl' });
            }
            
        }
        
      }

      public getUrl() {
        return this.sanitizer.bypassSecurityTrustUrl(this.itemDetail.documentazione);
    }
}