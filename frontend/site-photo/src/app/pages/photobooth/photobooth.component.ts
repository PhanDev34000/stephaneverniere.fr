import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PhotoboothService, PhotoboothReservationDto } from '../../services/photobooth.service';

@Component({
  standalone: true,
  selector: 'app-photobooth',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './photobooth.component.html'
})
export class PhotoboothComponent {
  private fb = inject(FormBuilder);
  private photoboothApi = inject(PhotoboothService); // (ex- this.api)

  today = new Date().toISOString().slice(0, 10);
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  form = this.fb.group({
    nom: [''],
    prenom: [''],
    mail: ['', [Validators.email]],
    date: [''],
    duree: [''],
    lieu: [''],
    message: ['', Validators.required] // SEUL champ requis (ta contrainte)
  });

  submit(): void {
    this.success.set(null);
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.getRawValue() as PhotoboothReservationDto;

    this.loading.set(true);
    this.photoboothApi.reserver(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Demande envoyée. Nous revenons vers vous rapidement !');
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => { // (e) typé
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Une erreur est survenue. Réessayez.');
      }
    });
  }
}
