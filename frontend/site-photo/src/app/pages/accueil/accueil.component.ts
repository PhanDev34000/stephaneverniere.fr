// accueil.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilmStripComponent } from '../../component/film-strip/film-strip.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, FilmStripComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  nbPhotos = 0;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Photographe Montpellier | Mariage, Événementiel, Portraits – Stéphane Vernière',
      description: 'Photographe professionnel à Montpellier : mariage, événementiel, reportage, portraits. Location de photobooth pour vos soirées et événements. Devis gratuit.',
      url: '/'
    });
  }
}