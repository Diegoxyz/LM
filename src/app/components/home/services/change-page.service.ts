import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ChangePage {

    private _page = new Subject();
    page$ = this._page.asObservable();

    goToPage(pageNumber: number) {
        if (pageNumber !== undefined && pageNumber !== null && pageNumber >= 0 && pageNumber <= 4) {
            this._page.next(pageNumber);
        }
    }
  }