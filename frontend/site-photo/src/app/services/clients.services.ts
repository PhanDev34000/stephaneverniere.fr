import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  list(): Observable<Client[]> {
    return this.http.get<Client[]>('/api/admin/clients');
  }
  create(dto: CreateClientDto): Observable<Client> {
    return this.http.post<Client>('/api/admin/clients', dto);
  }
  update(id: string, dto: UpdateClientDto): Observable<Client> {
    return this.http.put<Client>(`/api/admin/clients/${id}`, dto);
  }
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/api/admin/clients/${id}`);
  }
  updatePassword(id: string, password: string) {
    return this.http.put<void>(`/api/admin/clients/${id}/password`, { password });
  }

}
