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
    const handledProduct = {
      product : product,
      quantity : quantity
    }
    this._product.next(handledProduct);
  }
}