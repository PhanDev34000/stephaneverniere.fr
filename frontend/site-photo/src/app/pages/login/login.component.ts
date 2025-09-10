import {  inject,Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  identifiant = '';
  password = '';
  loading = false;
  error: string | null = null;
  private authService = inject(AuthService);


  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(f: NgForm) {
  this.error = '';
  if (!f.valid) { return; }

  // Accepte soit "email", soit "identifiant" (ton ancien champ)
  const email = (f.value.email || f.value.identifiant || '').trim();
  const password = (f.value.password || '').trim();

  if (!email || !password) {
    this.error = 'Email et mot de passe requis.';
    return;
  }
console.log('email=', email, 'password length=', password?.length);

  this.authService.login(email, password).subscribe({
    next: () => {
      // redirection si tu veux
      this.router.navigateByUrl('/admin');
    },
    error: (e) => {
  console.error('Firebase auth error:', e?.code, e?.message);
  this.error = e?.message || 'Connexion impossible.';
}
  });
}
};

