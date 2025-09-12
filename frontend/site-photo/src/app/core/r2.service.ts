import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class R2Service {
  constructor(private http: HttpClient) {}

  getPresignedUrl(name: string, contentType: string) {
    return this.http.post<{ ok: boolean; url: string }>(
      `${environment.API_BASE}/photos/r2/presign`,
      { name, contentType }
    );
  }

  async uploadFile(file: File): Promise<void> {
    const res = await this.getPresignedUrl(file.name, file.type).toPromise();
    if (res && res.ok) {
      await fetch(res.url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
    } else {
      throw new Error('Impossible de récupérer l’URL présignée');
    }
  }
}
