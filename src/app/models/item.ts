/* import { ExecFileOptionsWithStringEncoding } from 'child_process'; */

export class Item {
    code: string;
    description: string;
    family:string;
    /* ID dell'immagine, non sempre è presente */
    picId?: string;
    picId1?: string;
    picId2?: string;
    picId3?: string;
    picId4?: string;
    /* itemNumBom: string; */
    emptyItem?: boolean;

    constructor(code?: string, description?: string, family?: string, LoioId?: string, LoioId1?: string, LoioId2?: string, LoioId3?: string, LoioId4?: string)  {
        // some logic may be required
        this.code = code;
        this.description = description;
        this.family = family;
        this.picId = LoioId;
        this.picId1 = LoioId1;
        this.picId2 = LoioId2;
        this.picId3 = LoioId3;
        this.picId4 = LoioId4;
        this.emptyItem = false;

    } 
}

export class Product extends Item {
    price: number;
    stock: boolean;
    currency: string;
    maxQuantity?: number;
    minQuantity?: number;
    /* ID dell'immagine, non sempre è presente */
    picId?: string; 
    thumbnail? : any;
    svgThumbnail?: any;
    itemNumBom: string;
    stockIndicator: string;
    // Gerarchia
    prodh: string;
    prodhx: string;
    preferred: boolean;
    // Unità di misura della quantità, ad es. "pezzi", 
    meins: string;
    strItemNumBom : string;
    noteCliente?: string;
    documentazione?: string;
    noteGenerali?: string;
    matNrSub?: string;
    maktxSub?: string;
    kdmat?: string;
    htmlPosition? : string; // usato solo per fare lo scroll a video
    invalidQuantity? : boolean;
    invalidQuantityFormat? : boolean;
    
    constructor(code: string, description: string, price: number, currency: string, 
                stock: boolean, prodh: string, prodhx: string, pref : string, 
                meins : string, maxQuantity? : number, minQuantity?: number, 
                LoioId?: string, LoioId1?: string, LoioId2?: string, LoioId3?: string, LoioId4?: string, 
                itemNumBom?: string, stockIndicator?: string , noteCliente?: string, 
                documentazione?: string, noteGenerali?: string, matNrSub?: string, 
                maktxSub?: string, kdmat?: string  ) {
        super(code, description);
        this.price = price;
        this.stock = stock;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
        this.currency = currency;
        this.picId = LoioId;
        this.picId1 = LoioId1;
        this.picId2 = LoioId2;
        this.picId3 = LoioId3;
        this.picId4 = LoioId4;
        this.itemNumBom = itemNumBom;
        try {
            this.strItemNumBom = '' + Number(itemNumBom);
        } catch (error) {
            this.strItemNumBom = itemNumBom;
        }
        this.stockIndicator = stockIndicator;
        this.prodh = prodh;
        this.prodhx = prodhx;
        if (pref.toUpperCase() === 'X') {
            this.preferred = true;
        } else {
            this.preferred = false;
        }
        this.meins = meins;
        this.noteCliente = noteCliente;
        this.documentazione = documentazione;
        this.noteGenerali = noteGenerali;
        this.matNrSub = matNrSub;
        this.maktxSub = maktxSub;
        this.kdmat = kdmat;
    }
}

export class Group extends Item {
}