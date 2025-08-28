import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type LoginResponse = { token: string; role: 'admin' | 'utilisateur' };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api/auth';
  private storageKey = 'sv_token';
  private roleKey = 'sv_role';

  constructor(private http: HttpClient) {}

  login(identifiant: string, password: string) {
    return this.http.post<LoginResponse>(`${this.api}/login`, { identifiant, password });
  }

  saveAuth({ token, role }: LoginResponse) {
    localStorage.setItem(this.storageKey, token);
    localStorage.setItem(this.roleKey, role);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  getRole(): 'admin' | 'utilisateur' | null {
    return (localStorage.getItem(this.roleKey) as any) ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.roleKey);
  }
}
