export interface UserDataSet {
    /* Codice utente */
    Kunnr: string, 
    /* Linguaggio */
    Langu: string,
    KunnrRif: string,
    Kunnrx: string,
    KunnrRifx: string,
    Parnr: string,
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