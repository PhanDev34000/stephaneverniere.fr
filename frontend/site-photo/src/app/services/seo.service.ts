// src/app/services/seo.service.ts
// Service centralisé pour gérer le titre et les metas de chaque page

import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  private readonly baseUrl = 'https://stephaneverniere.fr';
  private readonly defaultImage = `${this.baseUrl}/assets/images/seo.jpg`;

  constructor(private title: Title, private meta: Meta) {}

  updateSeo(config: SeoConfig): void {
    const fullUrl = config.url ? `${this.baseUrl}${config.url}` : this.baseUrl;
    const image = config.image || this.defaultImage;

    // Titre de l'onglet navigateur
    this.title.setTitle(config.title);

    // Meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: fullUrl });
    this.meta.updateTag({ property: 'og:image', content: image });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Canonical URL — met à jour ou crée le lien canonical
    this.updateCanonical(fullUrl);
  }

  private updateCanonical(url: string): void {
    // Supprime l'ancien canonical s'il existe
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.setAttribute('href', url);
    } else {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }
}