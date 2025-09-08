import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { GalleriesService, MyGallery } from '../../services/galleries.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-telechargements',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './telechargements.component.html',
  styleUrls: ['./telechargements.component.scss']
})
export class TelechargementsComponent {
  private api = inject(GalleriesService);

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  galleries = signal<MyGallery[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null); this.success.set(null);
    this.api.listMine().subscribe({
      next: (list) => { this.loading.set(false); this.galleries.set(list); },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || 'Erreur de chargement.'); }
    });
  }

  downloadZip(g: MyGallery): void {
    this.loading.set(true);
    this.error.set(null); this.success.set(null);
    this.api.downloadZip(g._id).subscribe({
      next: (blob) => {
        this.loading.set(false);
        const name = (g.title || 'galerie').replace(/[^\w.-]+/g, '_') + '.zip';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || 'Téléchargement impossible.'); }
    });
  }
}
