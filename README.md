Dependecies:

Bootstrap: 4.4.1
Angular 9

Layout:
	ng add @ng-bootstrap/ng-bootstrap

Paginazione:
	ngx-pagination: npm install ngx-pagination --save
Link utile: https://www.freakyjolly.com/angular-pagination-example-using-ngx-pagination/
Io l'ho usata nella classe main.component.html e main.component.ts.
Ho usato una grafica base, si può migliorare, il link spiega in basso come.
	
Odata:
	npm i uuid
	npm i odata-query
	npm i angular-odata

Localization (punto aperto, vedi sotto):
	ng add @angular/localize
	
Modifiche fatte dopo user management:

- Aggiunta classe AuthGuard per verificare se l'utente è loggato
	account.service: metodi per login e logout
	Creati due moduli: 
		account.module.ts per gestire login, registrazione, lost credentials
		Sono nel path lm\src\app\components\login 
		
		home.module.ts per gestire home page (componente Main), Catalogo (Componente Catalogue), Boards (tavole)
		Sono nel path lm\src\app\components\home
	
	Per gestire routing delle pagine: app-routing gestisce i routing principali, ad account e home, i vari moduli gestiscono i path che vanno oltre,
	ad esempio in account-routing.module.ts ci sono i routes per le sottopagine, login, registrazione e lost credentials
	
	Per accettarsi che l'utente possa accedere a determinate pagine solo se loggato si usa questa configurazione in app-routing:
	{ path: 'home', loadChildren: homeModule, canActivate: [AuthGuard]},
	
	Per le pagine di login l'utente non deve essere loggato quindi si usa questa configurazione:
	{ path: 'account', loadChildren: accountModule },
	
- Ho aggiunto una variabile in environment (usato per installazione in development) e environment.prod.ts (installazione in prod, SAP)
	per abilitare o disabilitare gli odata.
	In account-service (AccountService) metodo login la uso ad esempio per dire che l'utente è loggato senza chiamare gli odata.
	In classi simili potrà essere usata per popolare con dati di esempio le classi senza chiamare odata, che richiedono l'uso di un'altra vpn

- Ho aggiunto un pulsante logout (che secondo me sarà meglio mostrare come icona) per testare il logout.
L'utente e relativo token è salvato nel localStorage, qui andrà salvate anche le eventuali preferenze dell'utente

Problemi aperti:
	
	1) Traduzioni (internalization / locales): Il cliente vuole fare traduzioni in real time, ovvero l'utente sceglie la lingua
	il support di default di angular attualmente lo supporta in modo limitato, l'applicazione deve essere installata in diverse
	directories, una per ogni linguaggio, quindi dovremo valutare se passare a ngx-translate anche se più vecchio
	
	2) Odata: la libreria che ci hanno suggerito mi da qualche problema con il post, ovvero dopo il posto sembra non catturare i valori aggiornati dell'oggetto, mi dice che è un oggetto object ma nessuno campo è popolato
		, il get con gli odata di sap non ho ancora avuto modo di testarlo perché non ci sono dati
		
	3) Quando installato su SAP se si scrive nella url un path diverso da quello dell'applicazione, 
		tipo <applicazione/home> (https://lm-s0020186995trial.dispatcher.hanatrial.ondemand.com/home),
		dà errore 500 oppure dice che la pagina non esiste. Probabilmente è un problema di configurazione nel file neo-app.json usato da SAP,
		ho provato sia con * sia con ** sia con l'elenco delle pagine ma al momento niente da fare.
		Dentro questo questo file andranno messi anche le configurazioni per la cache.
		
	4) Ho provato ad usare la dropdown suggerita qui: https://ng-bootstrap.github.io/#/components/dropdown/examples
		ma non mi funziona, che significa che invece di essere mostrata "chiusa" e cliccabile viene mostrata aperta con tutti i campi uno di fianco all'altro
	
Comandi:
npm start per farlo partire in locale
ng build --prod per creare la versione da installare in SAP, versione produzione

Utilities:
Per installare diverse versioni di Node.js (aka: Angular): https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/
Per creare nuovo progetto angular: https://www.techiediaries.com/angular/angular-9-tutorial-and-example/

# Lm

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
