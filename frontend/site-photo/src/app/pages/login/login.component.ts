import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  identifiant = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.auth.login(this.identifiant, this.password).subscribe({
      next: () => {
        this.error = null;
        this.router.navigate(['/admin']); // redirige vers admin
      },
      error: err => {
        this.error = err.error?.message || 'Échec de la connexion';
      }
    });
  }
}
