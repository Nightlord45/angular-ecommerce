import {Component, OnInit} from '@angular/core';
import {Product} from '../../common/product';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{

  product!: Product;

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
        this.handleProductDetails();
      }
    )
  }

  private handleProductDetails() {

    // Get the "id" param string. Convert string to a number using the "+" symbol
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductDetail(productId).subscribe(
      data => this.product = data
    );
  }
}
