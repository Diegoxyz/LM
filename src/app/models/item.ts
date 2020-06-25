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
    maxQuantity?: number;
    minQuantity?: number;

    constructor(code: string, description: string, price: number, stock: boolean, maxQuantity? : number, minQuantity?: number) {
        super(code, description);
        this.price = price;
        this.stock = stock;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
    }
}

export class Group extends Item {
}