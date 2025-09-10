// src/app/core/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('sv_token');

  // N’ajoute le header que pour nos appels API (API_BASE est utilisé côté services)
  if (token && req.url.includes('/api/')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};
