export class Item {
    code: string;
    description: string;
    family:string;
    /* ID dell'immagine, non sempre è presente */
    picId?: string; 
    constructor(code?: string, description?: string, family?: string, LoioId?: string) {
        // some logic may be required
        this.code = code;
        this.description = description;
        this.family = family;
        this.picId = LoioId;
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
    
    constructor(code: string, description: string, price: number, currency: string, stock: boolean, maxQuantity? : number, minQuantity?: number, LoioId?: string) {
        super(code, description);
        this.price = price;
        this.stock = stock;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
        this.currency = currency;
        this.picId = LoioId;
    }
}

export class Group extends Item {
}