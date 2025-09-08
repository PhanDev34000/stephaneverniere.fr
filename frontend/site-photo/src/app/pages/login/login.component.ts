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
    next: (res: any) => {
  this.auth.saveAuth(res);     // stocke token + rôle (quel que soit le format back)
  this.loading = false;

  const role = this.auth.getRole();
  this.router.navigateByUrl(role === 'admin' ? '/admin' : '/mon-espace');
},

error: (err) => {
  this.error = err?.error?.error || 'Identifiants invalides';
  this.loading = false;
}

    });
  }
}
