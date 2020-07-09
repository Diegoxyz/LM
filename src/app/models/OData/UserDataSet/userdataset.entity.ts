export interface UserDataSet {
    /* Codice utente */
    Kunnr: string, 
    Stras: string, /* indirizzo */
    /* Linguaggio */
    Langu: string,
    Pstlz: string, /* CAP */
    KunnrRif: string,
    Ort01: string, /* Citta' */
    Kunnrx: string, /* Nome */
    Regio: string, /* Provincia o Stato (per gli USA ad esempio) */
    KunnrRifx: string, /* Da ignorare */
    Parnr: string,
    Land1: string, /* Stato / Country: Italia */
    Email: string,
    ErdatAct: string,
    UzeitAct: string,
    /* Se valorizzata l'utente deve essere reindirizzato alla pagina di cambio password */
    PswInitial: string,
    /* 2 se l'utente è normale, possono cambiare le pagine a variare il seguente valore */
    Scenario: string,
    Ruolo: string,
    ErdatChangePsw: string,
    UzeitChangePsw: string,
    Token: string
}