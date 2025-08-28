import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GalleryFile {
  fileId: string;
  name: string;
  size: number;
  contentType: string;
  uploadedAt?: string;
}

export interface Gallery {
  _id: string;
  clientId: string;
  title: string;
  files?: GalleryFile[];
}

export interface CreateGalleryDto {
  clientId: string;
  title: string;
}

export interface UpdateGalleryDto {
  title?: string;
}

export interface MyGallery {
  _id: string;
  title: string;
  filesCount: number;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class GalleriesService {
  constructor(private http: HttpClient) {}

  // --- Admin ---
  list(): Observable<Gallery[]> {
    return this.http.get<Gallery[]>('/api/admin/galleries');
  }
  create(dto: CreateGalleryDto): Observable<Gallery> {
    return this.http.post<Gallery>('/api/admin/galleries', dto);
  }
  uploadFiles(galleryId: string, files: File[]): Observable<Gallery> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return this.http.post<Gallery>(`/api/admin/galleries/${galleryId}/files`, form);
  }
  update(id: string, dto: UpdateGalleryDto): Observable<Gallery> {
    return this.http.put<Gallery>(`/api/admin/galleries/${id}`, dto);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/galleries/${id}`);
  }

  // --- Commun (admin + client) ---
  downloadZip(galleryId: string) {
    return this.http.get(`/api/galleries/${galleryId}/download.zip`, { responseType: 'blob' });
  }

  // --- Client ---
  listMine(): Observable<MyGallery[]> {
    return this.http.get<MyGallery[]>('/api/me/galleries');
  }
}
