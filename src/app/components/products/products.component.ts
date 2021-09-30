import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  allProducts: any = [];
  toggleForm: boolean = false;
  showEditForm: boolean = false;
  success: boolean = false;
  error: boolean = false;
  errMsg: any;
  productForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  constructor(private service: ProductsService, private formBuilder: FormBuilder) {
    this.productForm = formBuilder.group({
      name: new FormControl(),
      description: new FormControl(),
      category: new FormControl(),
      units: new FormControl()
    })
  }

  ngOnInit(): void {
    this.products();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  // Function to Get product list from backend
  public products(): void {
    this.service
      .getProducts()
      .subscribe((response: any) => {
        this.allProducts = response;
        this.dtTrigger.next();
      });
  }

  // Function to Submit new post request for products
  postData() {
    this.success = false;
    this.error = false;
    this.service
      .postProducts(this.productForm.value)
      .subscribe((response: any) => {
        this.success = true;
        this.products();
        setTimeout(() => {
          this.success = false;
          this.toggleForm = false;
        }, 3000);
      },
        (error) => {
          this.error = true;
          this.errMsg = JSON.stringify(error.error.errors);
        });

  }

}
