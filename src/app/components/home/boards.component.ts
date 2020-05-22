import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product, Item} from 'src/app/models/item';
import { ActivatedRoute } from '@angular/router';
import { faWindowClose, faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({selector: 'app-boards',
templateUrl: './boards.component.html',
styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit,OnDestroy, OnChanges {

    machineId?: string;

    groups : Group[] = []; 
    
    items : Product[] =[];
    
    machines : Item[] = [];

    sections :string[];

    section: string;

    faWindowClose = faWindowClose;

    faCoffee = faCoffee;

    private sub: any;

    /* Sections to be dislayed, 0: machines, 1: section */
    @Input()
    sectionToBeDisplayed : number = 0;

    constructor(private productsService: ProductsService,
        private route: ActivatedRoute
    ) {
       /*  this.groups = this.productsService.getAllGroups(); */
    }
    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        throw new Error("Method not implemented.");
    }

    ngOnInit() {

        this.sub = this.route.queryParams.subscribe(params => {
            this.machineId = params['machineId']; 
            if (this.machineId) {
                // add the loading of all the "prospectives" for a specific machine
                this.sections = Array(23).fill(0).map((x, i) => (
                    `Section${i + 1}`
                    ));
            } else {
                this.sections = undefined;
            }
           

         });

        
        this.machines = this.productsService.getAllMachines();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    openSections(machine) {
        this.machines = [];
        this.section = "section";
        this.sections = Array(23).fill(0).map((x, i) => (
            `Section ${i + 1}`
            ));
        this.sectionToBeDisplayed = 1;
    }

    closeProspective() {
        this.sections = undefined;
    }

    goToMachine() {
        this.machineId = undefined;
        this.sections = undefined;
        this.machines = this.productsService.getAllMachines();
    }
}