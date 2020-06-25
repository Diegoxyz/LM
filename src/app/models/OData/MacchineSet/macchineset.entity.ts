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

        return item;
    }
}