// photographe.component.ts
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FilmStrip2Component } from '../../component/film-strip2/film-strip2.component';
import { Faq2Component } from '../../component/faq2/faq2.component';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-photographe',
  standalone: true,
  imports: [CommonModule, FilmStrip2Component, RouterLink, Faq2Component],
  templateUrl: './photographe.component.html',
  styleUrls: ['./photographe.component.scss']
})
export class PhotographeComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Photographe Mariage & Événementiel Montpellier | Stéphane Vernière',
      description: 'Photographe professionnel à Montpellier : reportage mariage, événementiel, portraits, reportages, packshot, corporate.  Devis gratuit et sans engagement.',
      url: '/photographe'
    });
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });
  }
}