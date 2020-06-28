import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product, Item} from 'src/app/models/item';
import { ActivatedRoute, Router } from '@angular/router';
import { faWindowClose, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { SectionService } from '@app/services/section.service';
import { Macchina } from '@app/models/OData/MacchineSet/macchineset.entity';
import { environment } from '@environments/environment';

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

    sections : string[] = [];

    section: string;

    faWindowClose = faWindowClose;

    faCoffee = faCoffee;

    @Input()
    private sectionId : number;

    private sub: any;

    /* Sections to be dislayed, 0: machines, 1: section */
    @Input()
    sectionToBeDisplayed : number;

    constructor(private productsService: ProductsService,
        private route: ActivatedRoute,private _router: Router,
        private sectionService : SectionService
    ) {
       /*  this.groups = this.productsService.getAllGroups(); */
       this.sub = this.route.paramMap.subscribe(params => {
        this.machineId = params.get('machineId'); 
        if (this.machineId) {
            // add the loading of all the "prospectives" for a specific machine
            this.sections = [];
            /* this.sections = Array(23).fill(0).map((x, i) => (
                `Section${i + 1}`
                ));  */
        } else {
            this.sections = undefined;
        }
       

     });

    this.machines = this.productsService.getAllMachines();
    }

    ngOnInit() {

        /* this.sub = this.route.paramMap.subscribe(params => {
            this.machineId = params.get('machineId'); 
            if (this.machineId) {
                // add the loading of all the "prospectives" for a specific machine
                this.sections = [];
                /* this.sections = Array(23).fill(0).map((x, i) => (
                    `Section${i + 1}`
                    ));  */
           /* } else {
                this.sections = undefined;
            }
           

         });

        this.machines = this.productsService.getAllMachines(); */
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    openSections(mach: Item) {
        this.sectionToBeDisplayed = 1;
        this.machines = [];
        this.section = "section";
        /* this.sections = Array(23).fill(0).map((x, i) => (
            `Section ${i + 1}`
            )); */
        // this.sections = this.sectionService.getMachineServices(machine.Matnr);
        // if (environment && environment.oData) {
            const code = mach.code.split(" ");
            this.sectionService.getMachineServices(code[1]).subscribe(resp => {
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(s => {
                        if (s) {
                            this.sections.push(s);
                        }
                    });
                }
            }); 
        // } 
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