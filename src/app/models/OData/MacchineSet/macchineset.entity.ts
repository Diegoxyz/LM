import { Item, Product } from '@app/models/item';

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

    static fromMacchinaJson(macchina : any) : Item {
        return this.fromJSON(macchina.Matnr,macchina.Email,macchina.Maktx, macchina.Token, macchina.Langu, macchina.Family, macchina.LoioId);
    }
    
    static fromJSON(Matnr : string, Email: string, Maktx: string, Token : string, Langu : string, Family: string, LoioId: string): Item {
        const item = new Item();
        item.code = Matnr;
        item.description = Maktx;
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

export class Materiale {
    Matnr: string;
    Kunnr: string;
    MengeBom: string;
    Maktx: string;
    Maxlf: string;
    Langu: string;
    Minlf: string;
    Matkl: string;
    Pref: string;
    Maktlx: string;
    Prodh: string;
    Prodhx: string;
    Kdmat: string;
    Netpr: string; // Price
    Waers: string; // Currency
    Labst: string;
    Meins: string;
    StockIndicator: string;
    Email: string;
    Token: string;
    ItemNumBom: string;
    MatnrSezione: string;
    LoioId: string;

    static fromJSON(m : Materiale): Product {
        const price : number = Number(m.Netpr);
        let isInStock = false;
        if (price > 0) {
            isInStock = true;
        }
        const maxQuantity = Number(m.Maxlf);
        const minQuantity = Number(m.Minlf);
       /*  const itNumB : string = '' + Number(m.ItemNumBom); */

        const product = new Product(m.Matnr,
                                    m.Maktx,
                                    price,
                                    m.Waers, 
                                    isInStock,
                                    m.Prodhx,
                                    m.Pref,
                                    m.Meins,
                                    maxQuantity,
                                    minQuantity
                                    ,m.LoioId
                                    ,m.ItemNumBom /*  itNumB */
                                    ,m.StockIndicator
                                    )
        return product;
    }
}