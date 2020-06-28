import { Item } from '@app/models/item';

export interface MacchineSet {
    /*
    "Matnr": "SC_LINEA-FB70",
        "Email": "",
        "Maktx": "CATALOGO LINEA-FB70",
        "Token": "",
        "Langu": "IT",
        "Family": "FB70",
        "LoioId": ""
    */
   Matnr: string,
   Email: string,
   Maktx: string,
   Token: string,
   Langu: string,
   Family: string,
   LoioId: string

}

export class Macchina implements MacchineSet {
    Matnr: string;
    Email: string;
    Maktx: string;
    Token: string;
    Langu: string;
    Family: string;
    LoioId: string;

    static fromJSON(Matnr : string, Email: string, Maktx: string, Token : string, Langu : string, Family: string, LoioId: string): Item {
        const item = new Item();
        item.code = Matnr;
        item.description = Maktx + Family;
        item.family = Family;
        item.picId=LoioId;
        return item;
    }
}

export class Section {
    MatnrMacchina: string;
    MatnrSezione: string;
    Maktx: string;
    Langu: string;
    LoioId: string;
    Email: string;
    Token: string;
    
    

    static fromJSON(MatnrMacchina : string, MatnrSezione: string, Maktx: string, Langu : string, LoioId: string, Email: string, Token: string): Item {
        const item = new Item();
        item.code = MatnrSezione;
        item.description = Maktx;
        item.family = MatnrMacchina;
        item.picId=LoioId;
        return item;
    }
}