export const UserDataSetMeta = {
    type: "UserDataSet",
    set: "UserDataSet",
    fields: {
        /* Codice utente */
      Kunnr: {type: 'string', nullable: true}, 
      /* Linguaggio */
      Langu: {type: 'string', nullable: true},
      KunnrRif: {type: 'string', nullable: true},
      Kunnrx: {type: 'string', nullable: true},
      KunnrRifx: {type: 'string', nullable: true},
      Parnr: {type: 'string', nullable: true},
      Email: {type: 'string', nullable: true},
      ErdatAct: {type: 'string', nullable: true},
      UzeitAct: {type: 'string', nullable: true},
      /* Se valorizzata l'utente deve essere reindirizzato alla pagina di cambio password */
      PswInitial: {type: 'string', nullable: true},
      /* 2 se l'utente è normale, possono cambiare le pagine a variare il seguente valore */
      Scenario: {type: 'string', nullable: true},
      Ruolo: {type: 'string', nullable: true},
      ErdatChangePsw: {type: 'string', nullable: true},
      UzeitChangePsw: {type: 'string', nullable: true},
      Token: {type: 'string', nullable: true}
    }
}