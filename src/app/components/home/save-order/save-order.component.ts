import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from '@app/services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-save-order',
  templateUrl: './save-order.component.html',
  styleUrls: ['./save-order.component.css']
})
export class SaveOrderComponent implements OnInit {


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private utilityService : UtilityService) { }

  public saveOrderForm: FormGroup;

  orderNumber : string;
  notes : string;

/*   ngOnInit(): void {

   this.saveOrderForm = this.fb.group({
      receiverID: ['', Validators.required],
      note: ['', Validators.required]
    });
  } */

  ngOnInit(): void {
    this.saveOrderForm = new FormGroup({
      note: new FormControl(null, Validators.required),
      receiverID: new FormControl(null, Validators.required)
    });

    this.orderNumber =this.route.snapshot.paramMap.get('orderNumber');
    this.receiverID.setValue(this.orderNumber);
    this.notes =this.route.snapshot.paramMap.get('notes');
    this.note.setValue(this.notes);
    console.log('SaveOrderComponent - orderNumber:' + this.orderNumber + '-' + this.notes );
  }
  

    get receiverID() {
      return this.saveOrderForm.get('receiverID');
    }
 
    get note() {
      return this.saveOrderForm.get('note');
    }
  
    

  onSubmit(): void {
    
  }

  onCancel(): void {
    this.router.navigate(['/home/cart']);
  }


}



/* 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from '@app/services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-save-order',
  templateUrl: './save-order.component.html',
  styleUrls: ['./save-order.component.css']
})
export class SaveOrderComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService, 
    private utilityService : UtilityService) { }

    public saveOrderForm: FormGroup;


  ngOnInit(): void {

    this.saveOrderForm = this.fb.group({
      note: ['', Validators.required],
      receiverID: ['', Validators.required]
    });
  }

  get receiverID() {
    return this.saveOrderForm.get('receiverID');
  }


  get note() {
    return this.saveOrderForm.get('note');
  }


  onSubmit(){}
} */
