import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ClientsService, Client } from '../../services/clients.services';
import { GalleriesService, Gallery, CreateGalleryDto } from '../../services/galleries.service';

@Component({
  standalone: true,
  selector: 'app-admin-galleries',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-galleries.component.html'
})
export class AdminGalleriesComponent {
  private fb = inject(FormBuilder);
  private clientsApi = inject(ClientsService);
  private galleriesApi = inject(GalleriesService);

  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  clients = signal<Client[]>([]);
  galleries = signal<Gallery[]>([]);

  editId = signal<string | null>(null);
  editBuffer: { title?: string } = {};

  pendingFiles: File[] = [];

  form = this.fb.group({
    clientId: ['', Validators.required],
    title: ['', Validators.required],
  });

  ngOnInit(): void { this.reload(); }

  reload(): void {
    this.loading.set(true);
    forkJoin({
      clients: this.clientsApi.list(),
      galleries: this.galleriesApi.list()
    }).subscribe({
      next: ({ clients, galleries }) => {
        this.clients.set(clients);
        this.galleries.set(galleries);
        this.loading.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(e?.error?.message || e.message);
      }
    });
  }

  clientName(id: string): string {
    const c = this.clients().find(x => x._id === id);
    return c ? (c.identifiant || c.email || c._id) : id;
  }

  onFiles(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    this.pendingFiles = input.files ? Array.from(input.files) : [];
  }

  create(): void {
    this.success.set(null); this.error.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const dto = this.form.getRawValue() as CreateGalleryDto;

    this.loading.set(true);
    this.galleriesApi.create(dto).subscribe({
      next: (g) => {
        const afterCreate = (finalGallery: Gallery) => {
          this.loading.set(false);
          this.success.set('Galerie créée.');
          this.form.reset();
          this.pendingFiles = [];
          this.galleries.set([finalGallery, ...this.galleries()]);
        };

        if (this.pendingFiles.length) {
          this.galleriesApi.uploadFiles(g._id, this.pendingFiles).subscribe({
            next: (g2) => afterCreate(g2),
            error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
          });
        } else {
          afterCreate(g);
        }
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  startEdit(g: Gallery): void { this.editId.set(g._id); this.editBuffer = { title: g.title }; }
  cancel(): void { this.editId.set(null); this.editBuffer = {}; }

  save(g: Gallery): void {
    this.loading.set(true);
    this.galleriesApi.update(g._id, this.editBuffer).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.success.set('Galerie mise à jour.');
        this.galleries.set(this.galleries().map(x => x._id === updated._id ? updated : x));
        this.cancel();
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  remove(g: Gallery): void {
    if (!confirm(`Supprimer la galerie "${g.title}" ?`)) return;
    this.loading.set(true);
    this.galleriesApi.delete(g._id).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Galerie supprimée.');
        this.galleries.set(this.galleries().filter(x => x._id !== g._id));
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  uploadMore(g: Gallery, ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (!files.length) return;

    this.loading.set(true);
    this.galleriesApi.uploadFiles(g._id, files).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.success.set(`${files.length} fichier(s) ajouté(s).`);
        this.galleries.set(this.galleries().map(x => x._id === updated._id ? updated : x));
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  downloadZip(g: { _id: string; title: string }) {
  this.loading.set(true);
  this.success.set(null); this.error.set(null);

  this.galleriesApi.downloadZip(g._id).subscribe({
    next: (blob) => {
      this.loading.set(false);
      const name = (g.title || 'galerie').replace(/[^\w.-]+/g, '_') + '.zip';
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    error: (e) => {
      this.loading.set(false);
      this.error.set(e?.error?.message || 'Téléchargement impossible.');
    }
  });
}

}
