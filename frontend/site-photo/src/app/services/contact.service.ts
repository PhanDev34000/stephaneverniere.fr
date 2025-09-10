import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactDto {
  nom: string;
  prenom: string;
  mail: string;
  tel?: string;
  messagePour: 'photographe' | 'photobooth' | 'les-deux';
  date?: string;  // yyyy-mm-dd
  lieu?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  envoyer(dto: ContactDto): Observable<any> {
    return this.http.post(`${environment.API_BASE}/contact`, dto);

  }
}
