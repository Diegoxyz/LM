import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product, Item} from 'src/app/models/item';
import { ActivatedRoute, Router } from '@angular/router';
import { faWindowClose, faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({selector: 'app-boards-sections',
templateUrl: './boards-sections.component.html',
styleUrls: ['./boards-sections.component.css']
})
export class BoardsSectionsComponent implements OnInit,OnDestroy {

    @Input()
    machineId?: string = '1';

    groups : Group[] = []; 
    
    items : Product[] =[];
    
    machines : Item[] = [];

    sections :string[];

    section: string;

    faWindowClose = faWindowClose;

    faCoffee = faCoffee;

    @Input()
    private sectionId : number;

    private sub: any;

    /* Sections to be dislayed, 0: machines, 1: section */
    @Input()
    sectionToBeDisplayed : number = 1;

    constructor(private productsService: ProductsService,
        private route: ActivatedRoute,private _router: Router
    ) {
       /*  this.groups = this.productsService.getAllGroups(); */
    }

    ngOnInit() {

        this.sub = this.route.paramMap.subscribe(params => {
            this.machineId = params.get('machineId'); 
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
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    openSections(machine) {
        this.machines = [];
        this.section = "section";
        this.sections = Array(23).fill(0).map((x, i) => (
            `Section ${i + 1}`
            ));
        this._router.navigate(['./boards/sections']);
    }

    closeProspective() {
        this.sections = undefined;
    }

    goToMachine() {
        this.machineId = undefined;
        this.sections = undefined;
        this.machines = this.productsService.getAllMachines();
        this._router.navigate(['./home/boards']);
    }
}