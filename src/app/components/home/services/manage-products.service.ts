import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '@app/models/item';

@Injectable({
  providedIn: 'root'
})
export class ManageProducts {
  private _product = new Subject();
  manageProducts$ = this._product.asObservable();

  changeProduct(product : Product, quantity : number) {
    console.log('changeProduct:' + product);
    if (product !== null) {
      const handledProduct = {
        product : product,
        quantity : quantity
      }
      this._product.next(handledProduct);
    }
  }

  emptyCart() {
    console.log('ManageProducts - empty cart');
    this._product = new Subject();
    this.manageProducts$ = this._product.asObservable();
  }
}