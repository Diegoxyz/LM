import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/item';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  items : Product[] =[];
  
  config = {
    itemsPerPage: 9,
    currentPage: 1,
    totalItems: this.items.length
  };

  public maxSize: number = 9;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '<--',
      nextLabel: '-->',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };
  constructor(private productService: ProductsService) { }

  ngOnInit(): void {
    this.items = this.productService.getAllProducts();
  }

  get page(){
    return this.config.currentPage;
  }

  get pageSize(){
    return this.config.itemsPerPage;
  }

  onPageChange(event){
    console.log(event);
    this.config.currentPage = event;
  }

}
