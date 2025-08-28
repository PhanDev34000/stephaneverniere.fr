import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-espace-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './espace-admin.component.html',
  styleUrls: ['./espace-admin.component.scss']
})
export class EspaceAdminComponent {
  me: any = null;
  error: string | null = null;
  loading = false;

  constructor(private http: HttpClient) {}

  testerMe() {
    this.loading = true;
    this.error = null;
    this.me = null;

    this.http.get('/api/auth/me').subscribe({
      next: (res) => { this.me = res; this.loading = false; },
      error: (err) => { this.error = err?.error?.error || 'Erreur'; this.loading = false; }
    });
  }
}
