import { Component } from '@angular/core';
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

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(f: NgForm) {
    if (f.invalid || this.loading) return;
    this.error = null;
    this.loading = true;

    this.auth.login(this.identifiant, this.password).subscribe({
      next: (res) => {
        this.auth.saveAuth(res);
        // Redirection selon le rôle
        if (res.role === 'admin') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/mon-espace');
        }
      },
      error: (err) => {
        this.error = err?.error?.error || 'Identifiants invalides';
        this.loading = false;
      }
    });
  }
}
