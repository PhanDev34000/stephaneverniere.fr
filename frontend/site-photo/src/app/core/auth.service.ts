import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.API_BASE}/auth`;
  private storageKey = 'sv_token';
  private roleKey = 'sv_role';

  constructor(private http: HttpClient) {}

  login(identifiant: string, password: string) {
    return this.http.post<{ token: string; user?: any }>(`${this.api}/login`, { identifiant, password })
      .pipe(map(res => {
        this.saveAuth(res.token);
        return res;
      }));
  }

  private saveAuth(token: string) {
    if (!token) return;
    localStorage.setItem(this.storageKey, token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload?.role) localStorage.setItem(this.roleKey, payload.role);
    } catch {}
  }

  getToken(): string | null { return localStorage.getItem(this.storageKey); }
  getRole(): 'admin' | 'utilisateur' | null {
    const cached = localStorage.getItem(this.roleKey);
    if (cached) return cached as any;
    const t = this.getToken(); if (!t) return null;
    try {
      const role = JSON.parse(atob(t.split('.')[1]))?.role ?? null;
      if (role) { localStorage.setItem(this.roleKey, role); return role as any; }
    } catch {}
    return null;
  }
  isLoggedIn() { return !!this.getToken(); }
  isAdmin() { return this.getRole() === 'admin'; }
  logout() { localStorage.removeItem(this.storageKey); localStorage.removeItem(this.roleKey); }
}
