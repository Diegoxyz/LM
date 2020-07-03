export class Item {
    code: string;
    description: string;
    family:string;
    /* ID dell'immagine, non sempre è presente */
    picId?: string;
    /* itemNumBom: string; */

    constructor(code?: string, description?: string, family?: string, LoioId?: string /* , ItemNumBom? :string  */ )  {
        // some logic may be required
        this.code = code;
        this.description = description;
        this.family = family;
        this.picId = LoioId;
        /* this.itemNumBom =  parseInt(ItemNumBom).toString(); */
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
    prodhx: string;
    preferred: boolean;
    
    constructor(code: string, description: string, price: number, currency: string, stock: boolean, prodhx: string, pref : string, maxQuantity? : number, minQuantity?: number, LoioId?: string, itemNumBom?: string, stockIndicator?: string ) {
        super(code, description);
        this.price = price;
        this.stock = stock;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
        this.currency = currency;
        this.picId = LoioId;
        this.itemNumBom = itemNumBom;
        this.stockIndicator = stockIndicator;
        this.prodhx = prodhx;
        if (pref.toUpperCase() === 'X') {
            this.preferred = true;
        } else {
            this.preferred = false;
        }
    }
}

export class Group extends Item {
}