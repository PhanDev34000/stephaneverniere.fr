import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type LoginResponse =
  | { token: string; role: 'admin' | 'utilisateur' }
  | { token: string; user: { role: 'admin' | 'utilisateur' } };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = '/api/auth';
  private storageKey = 'sv_token';
  private roleKey = 'sv_role';

  constructor(private http: HttpClient) {}

  login(identifiant: string, password: string) {
  // on accepte les 2 formats côté back
  return this.http.post<any>(`${this.api}/login`, { identifiant, password });
}

  saveAuth(res: any) {
      const token: string | null = res?.token ?? null;
      const roleFromRes: string | null = res?.role ?? res?.user?.role ?? null;

      if (token) localStorage.setItem(this.storageKey, token);

      let role = roleFromRes;
      if (!role && token) {
        // fallback: on décode le JWT si role non présent à la racine
        try { role = JSON.parse(atob(token.split('.')[1]))?.role ?? null; } catch {}
      }
      if (role) localStorage.setItem(this.roleKey, role);
    }


  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  getRole(): 'admin' | 'utilisateur' | null {
  let role = localStorage.getItem(this.roleKey);
  if (role && role !== 'undefined') return role as any;

  const token = this.getToken();
  if (!token) return null;
  try {
    role = JSON.parse(atob(token.split('.')[1]))?.role ?? null;
    if (role) {
      localStorage.setItem(this.roleKey, role);
      return role as any;
    }
  } catch {}
  return null;
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
