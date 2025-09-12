import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 AJOUT
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  identifiant = '';
  password = '';
  error: string | null = null;
  loading = false; // 👈 AJOUT pour corriger l’erreur

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.loading = true;

    this.auth.login(this.identifiant, this.password).subscribe({
      next: () => {
        this.error = null;
        this.router.navigate(['/admin']);
      },
      error: err => {
        this.error = err.error?.message || 'Échec de la connexion';
        this.loading = false;
      }
    });
  }
}
