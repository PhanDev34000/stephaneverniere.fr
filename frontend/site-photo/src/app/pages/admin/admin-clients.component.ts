import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientsService, Client, CreateClientDto } from '../../services/clients.services';


@Component({
  standalone: true,
  selector: 'app-admin-clients',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-clients.component.html'
})
export class AdminClientsComponent {
  private fb = inject(FormBuilder);
  private api = inject(ClientsService);

  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  clients = signal<Client[]>([]);
  editId = signal<string | null>(null);
  editBuffer: { identifiant?: string; email?: string; isActive?: boolean } = {};

  // champ de MDP (non pré-rempli – on ne peut pas récupérer l'ancien)
  editPassword = '';

  form = this.fb.group({
    identifiant: ['', Validators.required],
    email: ['', Validators.email],
    password: ['', Validators.required],
  });

  ngOnInit() { this.reload(); }

  reload(): void {
    this.loading.set(true);
    this.api.list().subscribe({
      next: (list: any[]) => { this.loading.set(false); this.clients.set(list); },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  create(): void {
    this.success.set(null); this.error.set(null);
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dto = this.form.value as CreateClientDto;

    this.loading.set(true);
    this.api.create(dto).subscribe({
      next: (c) => {
        this.loading.set(false);
        this.success.set('Client créé.');
        this.form.reset();
        this.clients.set([c, ...this.clients()]);
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  startEdit(c: Client): void {
    this.editId.set(c._id);
    this.editBuffer = { identifiant: c.identifiant, email: c.email, isActive: c.isActive ?? true };
    this.editPassword = ''; // jamais pré-rempli
  }
  cancel(): void {
    this.editId.set(null);
    this.editBuffer = {};
    this.editPassword = '';
  }

  save(c: Client): void {
    this.loading.set(true);
    this.api.update(c._id, this.editBuffer).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.success.set('Client mis à jour.');
        this.clients.set(this.clients().map(x => x._id === updated._id ? updated : x));
        this.cancel();
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  changePassword(c: Client): void {
    this.success.set(null); this.error.set(null);
    if (!this.editPassword || this.editPassword.length < 6) {
      this.error.set('Mot de passe trop court (min 6).');
      return;
    }
    this.loading.set(true);
    this.api.updatePassword(c._id, this.editPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Mot de passe mis à jour.');
        this.editPassword = '';
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }

  remove(c: Client): void {
    if (!confirm(`Supprimer le client "${c.identifiant}" ?`)) return;
    this.loading.set(true);
    this.api.delete(c._id).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Client supprimé.');
        this.clients.set(this.clients().filter(x => x._id !== c._id));
      },
      error: (e: HttpErrorResponse) => { this.loading.set(false); this.error.set(e?.error?.message || e.message); }
    });
  }
}
