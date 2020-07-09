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

}