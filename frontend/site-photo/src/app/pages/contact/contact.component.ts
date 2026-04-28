import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ContactService, ContactDto } from '../../services/contact.service';
import { SeoService } from '../../services/seo.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit{
  private fb = inject(FormBuilder);
  private api = inject(ContactService);
 
  constructor(private seo: SeoService) {}

  today = new Date().toISOString().slice(0, 10);
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  // Tel optionnel, mais si présent => pattern simple (10 à 14 chiffres/espaces/+)
  telPattern = /^[\d\s+().-]{10,14}$/;

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    mail: ['', [Validators.required, Validators.email]],
    tel: ['', [Validators.pattern(this.telPattern)]],
    messagePour: ['photographe', Validators.required], // valeur par défaut
    date: [''],
    lieu: [''],
    message: ['', Validators.required]
  });

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Contact – Photographe & Photobooth Montpellier | Stéphane Vernière',
      description: 'Contactez Stéphane Vernière, photographe professionnel à Montpellier, pour un devis mariage, événementiel ou location de photobooth. Réponse sous 24h.',
      url: '/contact'
    });
  }


  submit(): void {
    this.success.set(null);
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.getRawValue() as ContactDto;

    this.loading.set(true);
    this.api.envoyer(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Message envoyé, merci ! Je reviens vers vous rapidement.');
        this.form.reset({ messagePour: 'photographe' });
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Une erreur est survenue. Réessayez.');
      }
    });
  }
}
