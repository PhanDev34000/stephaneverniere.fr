// src/app/services/photos.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Photo {
  _id: string;
  album: string;
  urls: { sm: string; md: string; lg: string };
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private http = inject(HttpClient);
  private base = '/api/photos'; 

  list(album = 'prestations', limit = 20, after?: string) {
    const params: any = { album, limit };
    if (after) params.after = after;
    return this.http.get<{ items: Photo[]; next: string | null }>(this.base, { params });
  }

  // src/app/services/photos.service.ts
  byFolder(folder: string, limit = 30) {
    return this.http.get<{ items: Photo[] }>('/api/photos/by-folder', { params: { folder, limit }});
  }

}
