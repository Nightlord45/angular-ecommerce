import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;



  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  handleListProducts(){
    // check if "id" parameter is available
    const  hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      // get the "id" param string, convert string to a number using the "+" symbol
      // "!": this is the non-null assertion operator.
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available -> default to category id 1
      this.currentCategoryId = 1;
    }

    // Check if we have a different category than previous
    if(this.previousCategoryId != this.currentCategoryId){
      this.pageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;


    // now get the products for the given category id
    this.productService.getProductListPaginate(this.pageNumber - 1,
                                               this.pageSize,
                                               this.currentCategoryId).
                                               subscribe(
      data=> {
        console.log('Pagination=' + JSON.stringify(data.page));
        this.products = data._embedded.products;
        this.pageNumber = data.page.number + 1;
        this.pageSize = data.page.size;
        this.totalElements = data.page.totalElements;
        console.log("totalPages " + this.totalElements );
      });
  }

  handleSearchProducts(){
    const searchKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // search for the products using keyword
    this.productService.searchProducts(searchKeyword).subscribe(
      data => this.products = data);
  }

  updatePageSize(value: string) {
    this.pageSize = +value;
    this.pageNumber = 1;
    this.listProducts();
  }
}
