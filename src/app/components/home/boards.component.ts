import { Component, OnInit, OnDestroy, Input, OnChanges, AfterViewInit, HostListener } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Group, Product, Item} from 'src/app/models/item';
import { ActivatedRoute, Router } from '@angular/router';
import { faWindowClose, faCoffee } from '@fortawesome/free-solid-svg-icons';
import { MacchineSetService } from '@app/models/OData/MacchineSet/macchineset.service';
import { Macchina, Section } from '@app/models/OData/MacchineSet/macchineset.entity';
import { environment } from '@environments/environment';
import { SectionService } from '@app/services/section.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '@app/services/account.service';

@Component({selector: 'app-boards',
templateUrl: './boards.component.html',
styleUrls: ['./boards.component.css']
})
export class BoardsComponent implements OnInit,OnDestroy, OnChanges, AfterViewInit {

    machineId?: string;

    groups : Group[] = []; 
    
    items : Product[] =[];
    
    machines : Item[] = [];

    sections :Item[] = [];

    section: string;

    faWindowClose = faWindowClose;

    faCoffee = faCoffee;

    private sub: any;

    /* Sections to be dislayed, 0: machines, 1: section, 2: prospective */
    @Input()
    sectionToBeDisplayed : number = 0;

    machine : Item;
    currentMatr: string;

    prospective : Item;

    selectedSection : Item;

    constructor(private productsService: ProductsService,private macchineService: MacchineSetService,
        private route: ActivatedRoute,private _router: Router, private sectionService : SectionService,
        private spinner: NgxSpinnerService, private translateService : TranslateService, private accountService : AccountService
    ) {
       /*  this.groups = this.productsService.getAllGroups(); */
    }
    ngAfterViewInit(): void {
        console.log('after view init');
        window.dispatchEvent(new Event('resize'));
    }
    ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
        console.log('boards - ngOnChanges');
    }

    ngOnInit() {

        /*this.sub = this.route.queryParams.subscribe(params => {
            this.machineId = params['machineId']; 
            if (this.machineId) {
                // add the loading of all the "prospectives" for a specific machine
                this.sections = Array(23).fill(0).map((x, i) => (
                    `Section${i + 1}`
                    ));
            } else {
                this.sections = undefined;
            }
           

         }); */
        if (environment && environment.oData) {
            /*this.spinner.show();
            this.macchineService.getAllMachines().subscribe(resp => {
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(m => {
                        if (m) {
                            this.machines.push(Macchina.fromJSON(m.Matnr, m.Email, m.Maktx, m.token, m.Langu, m.Family, m.LoioId));
                        }
                    });
                }
                this.spinner.hide();
            });*/
            this.translateService.onLangChange.subscribe(l => {
                this.loadData();
            });
            this.accountService.currentPage = 1;
        } else {
            this.machines = this.productsService.getAllMachines();
        }
    }



    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        
    }

    @HostListener('window:resize', ['$event'])
    sizeChange(event) {
    console.log('size changed.', event);
    }
    /* openSections(machine) {
        this.machines = [];
        this.section = "section";
        this.sections = Array(23).fill(0).map((x, i) => (
            `Section ${i + 1}`
            ));
        this.sectionToBeDisplayed = 1;
        this._router.navigate(['./home/sections/machine']);
    } */

    private loadData() {
        if (this.sectionToBeDisplayed === 0) {

        } else if (this.accountService.currentPage === 1 && this.sectionToBeDisplayed === 1) {
            this.sectionService.getMachineServices(this.currentMatr).subscribe(resp => {
                if (resp.body && resp.body.d && resp.body.d.results && resp.body.d.results.length > 0) {
                    resp.body.d.results.forEach(s => {
                        if (s) {
                            this.sections.push(Section.fromJSON(s.MatnrMacchina, s.MatnrSezione, s.Maktx, s.Langu, s.LoioId, s.Email, s.Token));
                        }
                    });
                }
                /*if (this.sections.length > 0) {
                    const numberOfElements = this.sections.length / 3;
                    console.log('numberOfElementsSection:' + numberOfElements + ',numberOfElements % 1:' + numberOfElements % 1);
                    if (numberOfElements % 1 !== 0) {
                      console.log('adding empty element');
                      const item : Item = new Item();
                      item.emptyItem = true;
                      this.sections.push(item);
                    }
                  }*/
                window.dispatchEvent(new Event('resize'));
            });
        }
    }

    openSections(mach: Item) {
        this.sectionToBeDisplayed = 1;
        this.machines = [];
        this.sections = [];
        this.section = "section";
        // this.sections = this.sectionService.getMachineServices(machine.Matnr);
        this.machine = mach;
        if (environment && environment.oData) {
            const code = mach.code.split(" ");
            console.log('openSections code:' + code + ',length:' + length);
            console.log('openSections code[1]:' + code[1]);
            let matrn = code[0];
            if (code.length > 1) {
                matrn = code[1];
            }
            this.currentMatr = matrn;
            this.loadData();
        } else {
            this.sections = this.productsService.getAllSections();
        }
        const sectionsPosition = document.getElementById('sections-position');
        
        // check the position before using it, it was scrolling too down, it may be due to different screen sizes
        setTimeout(function() {window.scrollTo(0, 0);},1);
        // this._router.navigate(['./home/sections/machine']);
    }

    openProspective(prosp: Item) {
        console.log('openProspective:' + prosp.code + '-' + prosp.description);
        this.selectedSection = prosp;
        this.prospective = prosp;
        this.sectionToBeDisplayed = 2;
    }

    closeProspective() {
        this.sections = undefined;
    }

    filterMacchine(items : Item[]) {
        if (items) {
            this.sectionToBeDisplayed = 0;
            this.machines = [];

            if (items.length > 0) {
                items.forEach(i => this.machines.push(i));
            } else {
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
        }
    }

    public previousSection($event) {
        let temp : Item = undefined;
        this.sections.forEach(s => {
            temp = s;
            if (this.selectedSection.code === s.code) {
                this.openProspective(temp);
            }             
        });
    }

    public nextSection($event) {
        let found = false;
        this.sections.forEach(s => {
            if (this.selectedSection.code === s.code) {
                found = true;
            } else if (found) {
                this.openProspective(s);
            }
             
        })
    }
}