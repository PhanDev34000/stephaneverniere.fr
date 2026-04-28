import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PhotoboothService, PhotoboothReservationDto } from '../../services/photobooth.service';
import { FilmStrip2Component } from '../../component/film-strip2/film-strip2.component';
import { FaqComponent } from '../../component/faq/faq.component';
import { map } from 'rxjs/operators';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-photobooth',
  imports: [CommonModule, ReactiveFormsModule, FilmStrip2Component, FaqComponent],
  templateUrl: './photobooth.component.html',
  styleUrls: ['./photobooth.component.scss']
})
export class PhotoboothComponent implements OnInit {
  private fb = inject(FormBuilder);
  private photoboothApi = inject(PhotoboothService);
  private seo = inject(SeoService);

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
    message: ['', Validators.required]
  });

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Location Photobooth Montpellier & Hérault | Stéphane Vernière',
      description: 'Location de photobooth animé à Montpellier : mariage, soirée d\'entreprise, anniversaire. Impressions instantanées, accessoires, livreur sur place. Devis gratuit.',
      url: '/photobooth'
    });
  }

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
        this.success.set('Demande envoyée, merci ! Je reviens vers vous rapidement.');
        this.form.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Une erreur est survenue. Réessayez.');
      }
    });
  }
}