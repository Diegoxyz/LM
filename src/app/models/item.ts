export class Item {
    code: string;
    description: string;

    constructor(code?: string, description?: string) {
        // some logic may be required
        this.code = code;
        this.description = description;
    } 
}

export class Product extends Item {
    price: number;
    maxQuantity?: number;
    minQuantity?: number;

    constructor(code: string, description: string, price: number, maxQuantity? : number, minQuantity?: number) {
        super(code, description);
        this.price = price;
        this.maxQuantity = maxQuantity;
        this.minQuantity = minQuantity;
    }
}

export class Group extends Item {
}