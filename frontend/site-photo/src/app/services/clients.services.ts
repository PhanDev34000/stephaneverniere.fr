import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Client {
  _id: string;
  identifiant: string;
  email?: string;
  isActive?: boolean;
}

export interface CreateClientDto {
  identifiant: string;
  password: string;
  email?: string;
}

export interface UpdateClientDto {
  identifiant?: string;
  email?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientsService {
  constructor(private http: HttpClient) {}

  list() {
    if (environment.DISABLE_BACKEND) {
      return of([] as Client[]);
    }
    return this.http.get<Client[]>(`${environment.API_BASE}/admin/clients`);
  }

  listClients() {
    if (environment.DISABLE_BACKEND) {
      return of([] as Client[]);
    }
    return this.http.get<Client[]>(`${environment.API_BASE}/admin/clients`);
  }

  create(dto: CreateClientDto): Observable<Client> {
    if (environment.DISABLE_BACKEND) {
      return of({} as Client);
    }
    return this.http.post<Client>(`${environment.API_BASE}/admin/clients`, dto);
  }

  update(id: string, dto: UpdateClientDto): Observable<Client> {
    if (environment.DISABLE_BACKEND) {
      return of({} as Client);
    }
    return this.http.put<Client>(`${environment.API_BASE}/admin/clients/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    if (environment.DISABLE_BACKEND) {
      return of(void 0);
    }
    return this.http.delete<void>(`${environment.API_BASE}/admin/clients/${id}`);
  }

  updatePassword(id: string, password: string): Observable<void> {
    if (environment.DISABLE_BACKEND) {
      return of(void 0);
    }
    return this.http.put<void>(`${environment.API_BASE}/admin/clients/${id}/password`, { password });
  }
}
