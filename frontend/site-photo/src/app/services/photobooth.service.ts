// src/app/services/photobooth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post('/api/photobooth/reserver', dto);
  }
}
