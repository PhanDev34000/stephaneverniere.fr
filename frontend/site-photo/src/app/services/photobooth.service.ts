// src/app/services/photobooth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PhotoboothReservationDto {
  nom?: string;
  prenom?: string;
  mail?: string;
  date?: string;           // ISO (yyyy-mm-dd)
  duree?: string;          // ex: "2h", "3h"
  lieu?: string;
  message: string;         // requis
}

@Injectable({ providedIn: 'root' })
export class PhotoboothService {
  constructor(private http: HttpClient) {}

  reserver(dto: PhotoboothReservationDto): Observable<any> {
    if (environment.DISABLE_BACKEND) {
      return throwError(() => new Error('Envoi indisponible (site statique).'));
    }

    return this.http.post(`${environment.API_BASE}/photobooth/reserver`, dto);
  }
}
