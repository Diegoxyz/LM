import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product, Item} from 'src/app/models/item';
import { ActivatedRoute, Router } from '@angular/router';
import { faWindowClose, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { MacchineSetService } from '@app/models/OData/MacchineSet/macchineset.service';
import { Macchina } from '@app/models/OData/MacchineSet/macchineset.entity';
import { environment } from '@environments/environment';

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

    constructor(private productsService: ProductsService,private macchineService: MacchineSetService,
        private route: ActivatedRoute,private _router: Router
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

        if (environment && environment.oData) {
            this.macchineService.getAllMachines().subscribe(resp => {
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(m => {
                        if (m) {
                            this.machines.push(Macchina.fromJSON(m.Matnr, m.Email, m.Maktx, m.token, m.Langu, m.Family, m.LoioId));
                        }
                    });
                }
            });
        } else {
            this.machines = this.productsService.getAllMachines();
        }
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
        this._router.navigate(['./home/sections/machine']);
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