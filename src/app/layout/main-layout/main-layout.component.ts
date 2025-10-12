import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterComponent } from '../../pages/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, MatDialogModule, HeaderComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent {}
