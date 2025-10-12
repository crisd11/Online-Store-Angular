import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';
import { Product, ProductQuery } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmAddDialogComponent } from '../../shared/confirm-add-dialog/confirm-add-dialog.component'
import { CartService } from '../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-catalog',
  templateUrl: './catalog.html',
  styleUrls: ['./catalog.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatPaginatorModule
  ]
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  totalItems = 0;
  page = 1;
  pageSize = 12;
  loading = signal(false);
  form!: FormGroup;
  
  categories = ['Audio', 'Periféricos', 'Monitores', 'Video'];

  constructor(private fb: FormBuilder,
    private productService: ProductService,
    private cartService: CartService,
    private dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = this.fb.group({
    search: [''],
    category: [''],
    sortBy: ['createdAt'],
    sortDir: ['desc'],
    minPrice: [''],
    maxPrice: ['']
  });
    this.form.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.page = 1; // reset paginación al cambiar filtros
      this.load();
    });
    this.load();
  }

  load(): void {
    const query: ProductQuery = {
      search: this.form.value.search || undefined,
      category: this.form.value.category || undefined,
      sortBy: (this.form.value.sortBy as any) || 'createdAt',
      sortDir: (this.form.value.sortDir as any) || 'desc',
      minPrice: this.form.value.minPrice ? Number(this.form.value.minPrice) : undefined,
      maxPrice: this.form.value.maxPrice ? Number(this.form.value.maxPrice) : undefined,
      page: this.page,
      pageSize: this.pageSize
    };

    this.loading.set(true);
    this.productService.getProducts(query).subscribe({
      next: res => {
        this.products = res.items;
        this.totalItems = res.totalItems;
        this.loading.set(false);
      },
      error: _ => this.loading.set(false)
    });
  }

  pageChange(ev: PageEvent) {
    this.page = ev.pageIndex + 1; // MatPaginator es 0-based
    this.pageSize = ev.pageSize;
    this.load();
  }

  clearFilters() {
    this.form.reset({ search: '', category: '', sortBy: 'createdAt', sortDir: 'desc', minPrice: '', maxPrice: '' });
  }

  addToCart(p: Product) {
  const dialogRef = this.dialog.open(ConfirmAddDialogComponent, {
    data: p,
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.cartService.addToCart(p, result);
    }
  });
}

}
