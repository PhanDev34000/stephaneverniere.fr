// src/app/services/photos.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GALLERIES } from '../data/galleries';

export interface Photo {
  _id: string;
  album: string;
  urls: { sm: string; md: string; lg: string };
  createdAt: string;
  context?: { custom?: { alt?: string } };   // 👈 AJOUT
}

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private http = inject(HttpClient);
  private base = `${environment.API_BASE}/photos`;
  private CLOUD = 'ddqhgtpia';

  private TAGS: Record<string, string> = {
    'booth': 'photobooth',
    'prestations/portrait': 'prestations_portrait',
    'prestations/packshot': 'prestations_packshot',
    'prestations/mariage': 'prestations_mariage',
    'prestations/institutionnel': 'prestations_institutionnel',
    'prestations/evenementiel': 'prestations_evenementiel',
    'prestations/divers': 'prestations_divers',
  };

  list(album = 'prestations', limit = 20, after?: string) {
    const params: any = { album, limit };
    if (after) params.after = after;
    return this.http.get<{ items: Photo[]; next: string | null }>(this.base, { params });
  }

  byFolder(folder: string, limit = 30) {
    const key = folder.toLowerCase();

    const allPrestations = Object.keys(GALLERIES)
      .filter(k => k.startsWith('prestations/'))
      .flatMap(k => GALLERIES[k]);

    const urls = (
      folder === 'prestations'
        ? allPrestations
        : (GALLERIES[key] ?? GALLERIES[folder] ?? [])
    ).slice(0, limit);

    const v = (u: string, w: number) => u.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);

    return of({
      items: urls.map(u => ({
        _id: u,
        album: folder,
        urls: { sm: v(u, 600), md: v(u, 1000), lg: v(u, 1600) },
        createdAt: new Date().toISOString(),
      }))
    });
  }

  getPhotosByTag(tag: string, limit = 40) {
    const url = `https://res.cloudinary.com/${this.CLOUD}/image/list/${encodeURIComponent(tag)}.json`;
    return this.http
      .get<{ resources: Array<{ public_id: string; format: string }> }>(url)
      .pipe(
        map(res =>
          (res.resources || []).slice(0, limit)
            .map(r => `https://res.cloudinary.com/${this.CLOUD}/image/upload/${r.public_id}.${r.format}`)
        )
      );
  }
}
