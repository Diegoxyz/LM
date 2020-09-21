import { UserDataSet } from './OData/UserDataSet/userdataset.entity';

export class User {
    username: string;
    password: string;
    token?: string;
    lang?: string;
}

export class UserData implements UserDataSet{
    Stras: string;
    Pstlz: string;
    Ort01: string;
    Regio: string;
    Land1: string;
    Kunnr: string;
    Langu: string;
    KunnrRif: string;
    Kunnrx: string;
    KunnrRifx: string;
    Parnr: string;
    Email: string;
    ErdatAct: string;
    UzeitAct: string;
    PswInitial: string;
    Scenario: string;
    Ruolo: string;
    ErdatChangePsw: string;
    UzeitChangePsw: string;
    Token: string;
    Name1: string;
    Name2: string;
    Stcd1: string;
    Stcd2: string;
    Telf1: string;
}

/*
Classe usata per richiedere accesso alla applicazione
 "Email": "roberto.mazzocato@delonghigroup.com",
                "Langu": "I",
                "Stcd1": "123456789", partita iva
                "Stcd2": "1234567890", codice fiscale
                "Name1": "Mario", nome
                "Name2": "Rossi", cognome
                "Telf1": "23232323", telefono
                "Ort01": "Maserada", città
                "Pstlz": "31052", cap
                "Regio": "TV", provincia
                "Sortl": "", vuoto
                "Stras": "via Piazzola 13", indirizzo esteso
                "Land1": "IT" stato
*/
export class UserReq {

    Email   : string;
    Stcd1   : string; // p.iva
    Stcd2   : string; // codice fiscale
    Name1   : string; // nome
    Name2   : string; // cognome
    Telf1   : string; // telefono
    Ort01   : string; // città
    Pstlz   : string; // cap
    Regio   : string; // id della regione
    Sortl   : string = ''; // da lasciare vuoto
    Stras   : string; // indirizzo
    Land1   : string; // id dello stato
    Langu   : string; // linguaggio
}