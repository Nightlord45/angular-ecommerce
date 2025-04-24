import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Product} from '../common/product';
import {map, Observable} from 'rxjs';
import {ProductCategory} from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryURL = 'http://localhost:8080/api/product-category';

  constructor(private http: HttpClient) { }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.http.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products),
    );
  }

  getProductCategories(): Observable<ProductCategory[]>{

    return this.http.get<GetResponseProductCategory>(this.categoryURL).pipe(
      map(response => response._embedded.productCategory),
    );
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
