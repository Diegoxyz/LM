import { Injectable } from '@angular/core';
import { Product, Group, Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  getAllProducts() : Product[] {
    const items : Product[] = Array(100).fill(0).map((x, i) => (
      new Product(`Code ${i + 1}`,`KIT RETROFIT PERFORMANCE TOUCH STRADA ${i + 1}`,  (i+1 * 10.11), 'EUR', (i%2 === 0), `Gr${i + 1}`, 'Gerarchia', (i%2 === 0)?'X':'','PZ', undefined, undefined, undefined, '00001')
      ));
    return items;
  }

  getAllGroups(): Group[] {
    const items : Group[] = Array(23).fill(0).map((x, i) => (
      new Product(`Gr${i + 1}`,`Material Group ${i + 1}`,(i+1 * 10), 'EUR', (i%2 === 0), `Gr${i + 1}`, 'Gerarchia', (i%2 === 0)?'X':'','PZ')
      ));
    return items;
  }

  getAllMachines() : Item[] {
    const items : Item[] = Array(23).fill(0).map((x, i) => (
      new Item(`Code ${i + 1}`,`Machine ${i + 1}`,`F1`)
      ));
    return items;
  }

  getAllSections() : Item[] {
    const items : Item[] = Array(23).fill(0).map((x, i) => (
      new Item(`Code ${i + 1}`,`Section ${i + 1}`)
      ));
    return items;
  }

  getAllOrders() : Product[] {
    const items : Product[] = Array(20).fill(0).map((x, i) => (
      new Product(`Code ${i + 1}`,`Product ${i + 1}`, (i+1 * 10), 'EUR', (i%2 === 0), `Gr${i + 1}`, 'Gerarchia', (i%2 === 0)?'X':'','PZ')
      ));
    return items;
  }

  getBoardsProducts() : Product[] {
    const items : Product[] = Array(50).fill(0).map((x, i) => (
      new Product(`Code ${i + 1}`,`Product ${i + 1}`, (i+1 * 10), 'EUR', (i%2 === 0), `Gr${i + 1}`, 'Gerarchia', (i%2 === 0)?'X':'','PZ',undefined,undefined,undefined,'00001')
      ));
    return items;
  }
}
