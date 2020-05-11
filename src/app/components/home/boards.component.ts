import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product, Item} from 'src/app/models/item';
import { ActivatedRoute } from '@angular/router';
import { faWindowClose, faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({selector: 'app-boards',
templateUrl: './boards.component.html',
styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit,OnDestroy {

    machineId?: string;

    groups : Group[] = []; 
    
    items : Product[] =[];
    
    machines : Item[] = [];

    prospectives :string[];

    prospective: string;

    faWindowClose = faWindowClose;

    faCoffee = faCoffee;

    private sub: any;

    constructor(private productsService: ProductsService,
        private route: ActivatedRoute
    ) {
       /*  this.groups = this.productsService.getAllGroups(); */
    }

    ngOnInit() {

        this.sub = this.route.queryParams.subscribe(params => {
            this.machineId = params['machineId']; 
           // add the loading of all the "prospectives" for a specific machine
           this.prospectives = Array(23).fill(0).map((x, i) => (
            `Prospettiva${i + 1}`
            ));

         });

        
        this.machines = this.productsService.getAllMachines();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openProspective() {
        this.machines = [];
        this.prospective = "prospetive";
    }

    closeProspective() {
        this.prospective = undefined;
    }

    goToMachine() {
        this.machineId = undefined;
        this.prospectives = undefined;
        this.machines = this.productsService.getAllMachines();
    }
}