import { Injectable } from '@angular/core';
import { Product, Group, Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  getAllProducts() : Product[] {
    const items : Product[] = Array(150).fill(0).map((x, i) => (
      new Product(`Code ${i + 1}`,`Product ${i + 1}`, (i+1 * 10), (i%2 === 0))
      ));
    return items;
  }

  getAllGroups(): Group[] {
    const items : Group[] = Array(23).fill(0).map((x, i) => (
      new Product(`Group${i + 1}`,`Gr${i + 1}`,(i+1 * 10), (i%2 === 0))
      ));
    return items;
  }

  getAllMachines() : Item[] {
    const items : Item[] = Array(23).fill(0).map((x, i) => (
      new Item(`Code ${i + 1}`,`Machine ${i + 1}`)
      ));
    return items;
  }

  getAllOrders() : Product[] {
    const items : Product[] = Array(20).fill(0).map((x, i) => (
      new Product(`Code ${i + 1}`,`Product ${i + 1}`, (i+1 * 10), (i%2 === 0))
      ));
    return items;
  }
}
