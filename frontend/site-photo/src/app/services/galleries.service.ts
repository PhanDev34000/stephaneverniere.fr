import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<Gallery[]>(`${environment.API_BASE}/admin/galleries`);
  }

  create(dto: CreateGalleryDto): Observable<Gallery> {
    return this.http.post<Gallery>(`${environment.API_BASE}/admin/galleries`, dto);
  }

  uploadFiles(galleryId: string, files: File[]): Observable<Gallery> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return this.http.post<Gallery>(`${environment.API_BASE}/admin/galleries/${galleryId}/files`, form);
  }

  update(id: string, dto: UpdateGalleryDto): Observable<Gallery> {
    return this.http.put<Gallery>(`${environment.API_BASE}/admin/galleries/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.API_BASE}/admin/galleries/${id}`);
  }

  // --- Commun (admin + client) ---
  downloadZip(galleryId: string) {
    return this.http.get(`${environment.API_BASE}/galleries/${galleryId}/download.zip`, { responseType: 'blob' });
  }

  // --- Client ---
  listMine(): Observable<MyGallery[]> {
    return this.http.get<MyGallery[]>(`${environment.API_BASE}/me/galleries`);
  }
}
