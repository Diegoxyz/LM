export class Item {
    code: string;
    description: string;
    family:string;

    constructor(code?: string, description?: string, family?: string) {
        // some logic may be required
        this.code = code;
        this.description = description;
        this.family = family;
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