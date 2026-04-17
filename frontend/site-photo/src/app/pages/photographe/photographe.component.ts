import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FilmStrip2Component } from '../../component/film-strip2/film-strip2.component';
import { Faq2Component } from '../../component/faq2/faq2.component';

@Component({
  selector: 'app-photographe',
  standalone: true,
  imports: [CommonModule, FilmStrip2Component, RouterLink, Faq2Component],
  templateUrl: './photographe.component.html',
  styleUrls: ['./photographe.component.scss']
})
export class PhotographeComponent implements AfterViewInit {

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });
  }
}