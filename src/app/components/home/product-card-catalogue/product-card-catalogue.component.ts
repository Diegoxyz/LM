import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from 'src/app/models/item';
import { Order } from '@app/models/order';
import { ManageProducts } from '../services/manage-products.service';
import { CartService } from '@app/services/cart.service';
import { faShoppingCart, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({selector: 'app-product-catalogue-card',
templateUrl: './product-card-catalogue.component.html',
styleUrls: ['./product-card-catalogue.component.css']
})
export class ProductCardCatalogueComponent implements OnInit {

    @Input() item: Product;
    quantity: number = 0; 
    quantityError : boolean = false;
    faShoppingCart=faShoppingCart;
    faCircle=faCircle;
    
    constructor(private fb: FormBuilder,private manageProducts: ManageProducts, private cartService : CartService) {
    }
    
    public addProductForm: FormGroup;
    
    ngOnInit(): void {
        //TODO We will load the image by odata, but for mock application let's use a fix one
        this.addProductForm = this.fb.group({
            qty: ['']
          });
        this.qty.setValue(0);
        this.cartService.getCart().orders.forEach(o => {
            if (o && this.item && o.product && o.product.code === this.item.code) {
                this.qty.setValue(o.quantity);
            }
        });

        
    }

    get qty() {
        return this.addProductForm.get('qty');
    }

    onKey(quantity: number) {
        if (quantity >= 0) {
            this.quantity = quantity;
        } else {
            this.quantity = 0;
            this.quantityError = true;
        }
    }
    
    addOneProduct() {
        if (this.quantity >= 0) {
            this.quantity = this.quantity + 1;
        }
        this.updateQuantityError();
    }

    addProduct() {
        if (this.qty && this.qty.value > 0) {
            this.manageProducts.changeProduct(this.item,this.qty.value);
        } else {
            this.quantityError = true;
        }
    }

    removeProduct() {
        if (this.quantity > 0) {
            this.quantity = this.quantity - 1;
        }
        this.updateQuantityError();
    }
    
    updateQuantityError() {
        if (this.quantity >= 0) {
            this.quantityError = false;
        } else {
            this.quantityError = true;
        }
    }
}