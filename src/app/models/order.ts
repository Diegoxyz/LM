import { Product } from './item';
import * as moment from 'moment';

export class Order {
    id          : string;
    product     : Product;
    quantity    : number;
    error?      : string;
}

/*
* Destinatario merce
{
	"Kunwe": "7000031",
	"Kunwex": "",
	"Email": "roberto.mazzocato@eservices.it",
	"Token": "000D3A2544DE1EDAB19CC98DA937628D",
	"Langu": "I",
	"Stras": "Via modificata 32",
	"Pstlz": "31052",
	"Ort01": "Maserada",
	"Regio": "TV",
	"Regiox": "",
	"Land1": "IT",
	"Land1x": ""
}
*/
export class Recipient {

    Kunwe   :   string; // id del destinatario merce
    Kunwex  :   string; // nome del destinatario merce
    Email   :   string;
    Token   :   string; // arriva vuoto e non serve
    Langu   :   string; // Linguaggio
    Stras   :   string; // Via del indirizzo
    Pstlz   :   string; // cap
    Ort01   :   string; // città
    Regio   :   string; // sigla provincia (ad es. TV)
    Regiox  :   string; // nome per esteso della provincia (ad es. Treviso)
    Land1   :   string; // stato (ad es. IT)
    Land1x  :   string; // nome per esteso dello stato (ad es. Italia)
}

// Classe da usare per il salvataggio del ordine
/*
{
        "Email":"roberto.mazzocato@eservices.it",
        "Token":"000D3A2544DE1EDAAED4925935EA028D",
        "Langu":"I",
        "Vbeln":"",
        "Note":"Note massimo 140 char",
        "Vdatu":"2020-08-01T00:00:00",
        "Kunwe":"7000031"
}
*/
export class SaveOrder {

    Email   :   string;
    Token   :   string;
    Langu   :   string;
    Vbeln   :   string;
    Note    :   string;
    Vdatu   :   string;
    Kunwe   :   string;
}