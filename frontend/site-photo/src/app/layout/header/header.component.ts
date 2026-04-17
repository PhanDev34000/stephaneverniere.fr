import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isScrolled = false;

  constructor(public auth: AuthService, private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  closeMenu() {
    const nav = document.querySelector('.navbar-collapse.show');
    if (nav) (nav as HTMLElement).classList.remove('show');
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}