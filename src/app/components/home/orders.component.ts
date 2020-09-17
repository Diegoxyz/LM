import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewChildren, QueryList, PipeTransform, ViewChild } from '@angular/core';
import { Cart } from '@app/models/cart';
import { environment } from '@environments/environment';
import { OrdersService } from '@app/services/orders.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { ExcelService } from '@app/services/excel.service';

class ShippedOrder {
  erdatFrom: string;
  erdatTo: string;
  vbeln: string;
  erdat: string;
  vdatu: any;
  note: string;
  netwr: string;
  waerk: string;
  name1: string;
  matnr: string;
  maktx: string;
  qty: string;
  meins: string;
  netpr: string;
  ort01: string;
  pstlz: string;
  stras: string;
  land1: string;
  posnr: string;
  totalRow: string;
  stateDesc: string;

}

class XSLXOrder {
  NumOrdine : string;
  Prodotto : string;
  Data : string;
  Totale : string;
  Destinazione : string;
  Pos : string;
  Qtà : string;
  PrUnitario : string;
  PrTotale : string;
  Stato : string;
}
export type SortColumn = '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
  })
  export class OrdersComponent implements OnInit {

    cart : Cart;

    items : ShippedOrder[] =[];
    allItems : ShippedOrder[] =[];
    direction : string = '';

    faSearch = faSearch;

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

    page = 1;
    
    search(text: string) {
      this.items = this.allItems.filter(item => {
        const term = text.toLowerCase();
        return item.matnr.toLowerCase().includes(term)
            || item.maktx.toLowerCase().includes(term)
            || item.note.toLowerCase().includes(term);
      });
    }

    onSort(column : string) {

      if (this.direction === 'asc') {
        this.direction = 'desc';
      } else if (this.direction === 'desc') {
        this.direction = 'asc';
      } else {
        this.direction = 'asc';
      }

      // resetting other headers
      this.headers.forEach(header => {
        if (header.sortable !== column) {
          header.direction = '';
        }
      });
  
      // sorting countries
      if (this.direction === '' || column === '') {
        this.items = this.allItems;
      } else {
        this.items = [...this.allItems].sort((a, b) => {
          const res = compare(a[column], b[column]);
          return this.direction === 'asc' ? res : -res;
        });
      }
    }

    errorMessage : string;
    totalQuantity : number;

    public searchForm: FormGroup;

    constructor(private fb: FormBuilder, private ordersService : OrdersService,
      private translateService : TranslateService, private spinner: NgxSpinnerService,
      private excelService : ExcelService) { }

    ngOnInit(): void {

      this.searchForm = this.fb.group(
        {
          orderNumber:  [''],
          fromDate:  [''],
          toDate: ['']
        } 
      );
      
      let defaultFromdate = (moment().add(-30, 'days')).format('YYYY-MM-DD');
      this.fromDate.setValue(defaultFromdate);

      let defaultToDate= (moment()).format('YYYY-MM-DD');
      this.toDate.setValue(defaultToDate);
    
      if (environment && environment.oData) {
        this.translateService.onLangChange.subscribe(l => {
          console.log('orders changed language');
          this.loadData();
        });
        this.loadData();
      } else {
        for(let i = 0; i < 40; i++) {
          const so : ShippedOrder = new ShippedOrder();
                
          so.erdatFrom = "\/Date(1593043200000)\/";
          so.erdatTo = "\/Date(1595635200000)\/";
          so.vbeln = "20000368-" + ('' + i);
          so.erdat = "\/Date(1594857600000)\/";
          const s : string = "\/Date(1595289600000)\/";
          const start = s.indexOf('(');
          const end = s.lastIndexOf(')');
          const slicedS = s.slice(start+1, end);
          const date : Date = new Date();
          
          date.setTime(Number.parseInt(slicedS));
          //so.vdatu = s.slice(start+1, end);
          so.erdat = date.toDateString();
          so.vdatu = "\/Date(1594857600000)\/";
          so.note = "Nota 1Prova";
          so.netwr = "180.000";
          so.waerk = "EUR";
          so.name1 = "ESSE";
          so.matnr = "900";
          so.maktx = "ELETTROPOMPA 150L/H 220V 50Hz";
          so.qty = "  1.000";
          so.meins = "PC";
          const netPrice = "100.000";
          so.netpr = Number.parseFloat(netPrice).toFixed(2);;
          so.ort01 = "LIVORNO";
          so.pstlz = "57121";
          so.stras = "VIA PROVINCIALE PISANA 583 C-D";
          so.land1 = "IT";
          so.posnr = "000050";
          const priceTotal = "20.700";
          so.totalRow = Number.parseFloat(priceTotal).toFixed(2);
          so.stateDesc = "Confermato";

          this.items.push(so);
          this.allItems.push(so);
        }
        this.totalQuantity = this.allItems.length;
      }

    }

    private loadData() {
      this.spinner.show();
      this.items = [];
      this.allItems = [];
        this.ordersService.getOrders().subscribe(resp => {
          console.log('resp:' + resp);
          const sapMessage = resp.headers.get('sap-message');
          if (sapMessage !== undefined && sapMessage !== null) {
            this.errorMessage = this.translateService.instant('unknownError');
            try {
              let sm = JSON.parse(sapMessage);
              this.errorMessage = sm.message;
            } catch (error) {
              const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
              if (docSapMessage.hasChildNodes()) {
                if (docSapMessage.firstChild.childNodes.length >= 2) {
                  this.errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                }
              }
            }
          }
          if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
            resp.body.d.results.forEach(s => {
              if (s) {
                const so : ShippedOrder = new ShippedOrder();
                
                so.meins = s.Meins;
                
                so.vbeln = s.Vbeln;
                let ts : string = s.Erdat;
                let start = ts.indexOf('(');
                let end = ts.lastIndexOf(')');
                let slicedS = ts.slice(start+1, end);
                let date : Date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.erdat = date.toDateString();
                ts = s.Vdatu;
                start = ts.indexOf('(');
                end = ts.lastIndexOf(')');
                slicedS = ts.slice(start+1, end);
                date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.vdatu = date.toDateString();
                ts = s.ErdatFrom;
                start = ts.indexOf('(');
                end = ts.lastIndexOf(')');
                slicedS = ts.slice(start+1, end);
                date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.erdatFrom = date.toDateString();
                ts = s.ErdatTo;
                start = ts.indexOf('(');
                end = ts.lastIndexOf(')');
                slicedS = ts.slice(start+1, end);
                date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.erdatTo = date.toDateString();
                so.note = s.Note;
                const netwr = s.Netwr;
                so.netwr = Number.parseFloat(netwr).toFixed(2);
                so.waerk = s.Waerk;
                so.name1 = s.Name1;
                so.matnr = s.Matnr;
                so.maktx = s.Maktx;
                const qty = s.Qty;
                so.qty = Number.parseFloat(qty).toFixed(2);
                so.meins = s.Meins;
                const netPrice = s.Netpr;
                so.netpr = Number.parseFloat(netPrice).toFixed(2);
                so.ort01 = s.Ort01;
                so.pstlz = s.Pstlz;
                so.stras = s.Stras;
                so.land1 = s.Land1;
                try {
                  so.posnr = '' + Number(s.Posnr);
                } catch (error) {
                  so.posnr = s.Posnr;
                }
                const priceTotal = s.TotalRow;
                so.totalRow = Number.parseFloat(priceTotal).toFixed(2);
                so.stateDesc = s.StateDesc;
                this.items.push(so);
                this.allItems.push(so);
              }
            });
            this.totalQuantity = this.allItems.length;
          }
          this.spinner.hide(); 
        });
    }
    get fromDate() { return this.searchForm.get('fromDate') };

    get toDate() { return this.searchForm.get('toDate') };

    get orderNumber() { return this.searchForm.get('orderNumber') };

    onSearch() {
      if (environment && environment.oData) {
        const fd = this.fromDate.value;
        const td = this.toDate.value;
        const on = this.orderNumber.value;
        this.spinner.show();
        this.items = [];
        this.allItems = [];
        this.ordersService.getOrders(fd,td,on).subscribe(resp => {
          console.log('resp:' + resp);
          const sapMessage = resp.headers.get('sap-message');
          if (sapMessage !== undefined && sapMessage !== null) {
            this.errorMessage = this.translateService.instant('unknownError');
            try {
              let sm = JSON.parse(sapMessage);
              this.errorMessage = sm.message;
            } catch (error) {
              const docSapMessage : Document = (new window.DOMParser()).parseFromString(sapMessage, 'text/xml');
              if (docSapMessage.hasChildNodes()) {
                if (docSapMessage.firstChild.childNodes.length >= 2) {
                  this.errorMessage = docSapMessage.firstChild.childNodes[1].textContent;
                }
              }
            }
          }
          if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
            resp.body.d.results.forEach(s => {
              if (s) {
                const so : ShippedOrder = new ShippedOrder();
                
                so.meins = s.Meins;
                so.vbeln = s.Vbeln;
                let ts : string = s.Erdat;
                let start = ts.indexOf('(');
                let end = ts.lastIndexOf(')');
                let slicedS = ts.slice(start+1, end);
                let date : Date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.erdat = date.toDateString();

                ts = s.Vdatu;
                start = ts.indexOf('(');
                end = ts.lastIndexOf(')');
                slicedS = ts.slice(start+1, end);
                date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.vdatu = date.toDateString();

                ts = s.ErdatFrom;
                start = ts.indexOf('(');
                end = ts.lastIndexOf(')');
                slicedS = ts.slice(start+1, end);
                date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.erdatFrom = date.toDateString();
                
                ts = s.ErdatTo;
                start = ts.indexOf('(');
                end = ts.lastIndexOf(')');
                slicedS = ts.slice(start+1, end);
                date = new Date();
                date.setTime(Number.parseInt(slicedS));
                so.erdatTo = date.toDateString();

                so.note = s.Note;
                const netwr = s.Netwr;
                so.netwr = Number.parseFloat(netwr).toFixed(2);
                so.waerk = s.Waerk;
                so.name1 = s.Name1;
                so.matnr = s.Matnr;
                so.maktx = s.Maktx;
                const qty = s.Qty;
                so.qty = Number.parseFloat(qty).toFixed(2);
                so.meins = s.Meins;
                const netPrice = s.Netpr;
                so.netpr = Number.parseFloat(netPrice).toFixed(2);
                so.ort01 = s.Ort01;
                so.pstlz = s.Pstlz;
                so.stras = s.Stras;
                so.land1 = s.Land1;
                try {
                  so.posnr = '' + Number(s.Posnr);
                } catch (error) {
                  so.posnr = s.Posnr;
                }
                const priceTotal = s.TotalRow;
                so.totalRow = Number.parseFloat(priceTotal).toFixed(2);
                so.stateDesc = s.StateDesc;
                this.items.push(so);
                this.allItems.push(so);
              }
            });
            this.totalQuantity = this.allItems.length;
          }
          this.spinner.hide(); 
        });
      }
    }

    /*
    NumOrdine : string;
  Data : string;
  Totale : string;
  Destinatario : string;
  Pos : string;
  Prodotto : string;
  Qtà : string;
  PrUnitario : string;
  PrTotale : string;
  Stato : string;
  */
    exportAsXLSX():void {
      const orders : XSLXOrder[] = [];
      this.allItems.forEach(a => {
        const order = {
          NumOrdine: a.vbeln,
          Pos: a.posnr,
          Data: a.erdat,
          Totale: a.netwr,
          Currency: a.waerk,
          Destinazione : a.name1 + ' ' + a.ort01 + ' ' + a.pstlz + ' ' + a.stras + ' ' + a.land1,
          PartNumber: a.matnr,
          Prodotto: a.maktx,
          Qtà: a.qty,
          UM: a.meins,
          PrUnitario : a.netpr,
          PrTotale : a.totalRow,
          Stato : a.stateDesc
        };
        orders.push(order);
      })
      this.excelService.exportAsExcelFile(orders , 'orders');
    }
  }