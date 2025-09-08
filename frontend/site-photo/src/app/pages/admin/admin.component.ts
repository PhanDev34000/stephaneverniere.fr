import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminClientsComponent } from './admin-clients.component';
import { AdminGalleriesComponent } from './admin-galleries.component';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, AdminClientsComponent, AdminGalleriesComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {}

