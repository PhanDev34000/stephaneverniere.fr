import { Component, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-intro',
  standalone: true,
  templateUrl: './splash-intro.component.html',
  styleUrls: ['./splash-intro.component.scss']
})
export class SplashIntroComponent implements OnDestroy {
  showText = signal(false);
  private t1?: number;
  private t2?: number;

  constructor(private router: Router) {
    // Affiche le texte à +2s
    this.t1 = window.setTimeout(() => this.showText.set(true), 1000);
    // Redirige à +4s vers /accueil (change le path si besoin)
    this.t2 = window.setTimeout(() => {
      this.router.navigate(['accueil']); // ou this.router.navigateByUrl('/accueil')
    }, 4000);
  }

  ngOnDestroy() {
    if (this.t1) clearTimeout(this.t1);
    if (this.t2) clearTimeout(this.t2);
  }
}
