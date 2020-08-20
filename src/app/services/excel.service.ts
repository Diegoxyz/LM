import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AccountService } from './account.service';
import { TranslateService } from '@ngx-translate/core';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
  })
export class ExcelService {

  constructor(private accountService : AccountService, private translateService: TranslateService) { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const language : string = this.accountService.getLanguage();
    console.log('exportAsExcelFile language:' + language);
    if ( language === undefined || language.toLocaleLowerCase() === 'en') {
      delete worksheet['A1'].w; 
      worksheet['A1'].v = "Order";
      delete worksheet['B1'].w; 
      worksheet['B1'].v = "Item";
      delete worksheet['C1'].w; 
      worksheet['C1'].v = "Date";
      delete worksheet['D1'].w; 
      worksheet['D1'].v = "Total";
      delete worksheet['E1'].w; 
      worksheet['E1'].v = "Ship-to";
      delete worksheet['F1'].w; 
      worksheet['F1'].v = "Product";
      delete worksheet['G1'].w; 
      worksheet['G1'].v = "Qty";
      delete worksheet['H1'].w; 
      worksheet['H1'].v = "Price Unit";
      delete worksheet['I1'].w; 
      worksheet['I1'].v = "Tot.Item";
      delete worksheet['J1'].w; 
      worksheet['J1'].v = "Status";
    } else {
      delete worksheet['A1'].w; 
      worksheet['A1'].v = "Num.Ordine";
      delete worksheet['B1'].w; 
      worksheet['B1'].v = "Prodotto";
      delete worksheet['C1'].w; 
      worksheet['C1'].v = "Data";
      delete worksheet['D1'].w; 
      worksheet['D1'].v = "Tot.Ordine";
      delete worksheet['E1'].w; 
      worksheet['E1'].v = "Destinazione";
      delete worksheet['F1'].w; 
      worksheet['F1'].v = "Pos.";
      delete worksheet['G1'].w; 
      worksheet['G1'].v = "Qtà";
      delete worksheet['H1'].w; 
      worksheet['H1'].v = "Pr.Unit.";
      delete worksheet['I1'].w; 
      worksheet['I1'].v = "Tot.Pos.";
      delete worksheet['J1'].w; 
      worksheet['J1'].v = "Stato";
    }
    
    console.log('worksheet',worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}