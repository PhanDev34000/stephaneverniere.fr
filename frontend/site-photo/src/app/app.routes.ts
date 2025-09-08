import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/auth.guard';
import { adminGuard } from './core/admin.guard';
import { SplashIntroComponent } from './splash-intro/splash-intro.component';

export const routes: Routes = [
  { path: '', component: SplashIntroComponent, pathMatch: 'full' }, 
  {
    path: 'accueil',
    title: 'Accueil',
    loadComponent: () =>
      import('./pages/accueil/accueil.component').then(m => m.AccueilComponent),
  },
  {
    path: 'photographe',
    title: 'Photographe',
    loadComponent: () =>
      import('./pages/photographe/photographe.component').then(m => m.PhotographeComponent),
  },
  {
    path: 'photobooth',
    title: 'Photobooth',
    loadComponent: () =>
      import('./pages/photobooth/photobooth.component').then(m => m.PhotoboothComponent),
  },
  {
    path: 'contact',
    title: 'Contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(m => m.ContactComponent),
  },
  {
    path: 'login',
    title: 'Connexion',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  { path: 'mon-espace', title: 'Téléchargements', canActivate: [authGuard],
  loadComponent: () => import('./pages/telechargements/telechargements.component').then(m => m.TelechargementsComponent) },

  {
    path: 'admin',
    title: 'Administration',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.AdminComponent),
  },
  
  { path: '**', redirectTo: '' }
];
