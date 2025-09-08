// photographe.component.ts (standalone)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilmStrip2Component } from '../../component/film-strip2/film-strip2.component';
import { Faq2Component } from '../../component/faq2/faq2.component';

@Component({
  selector: 'app-photographe',
  standalone: true,
  imports: [CommonModule, FilmStrip2Component, RouterLink, Faq2Component], 
  templateUrl: './photographe.component.html',
  styleUrls: ['./photographe.component.scss']
})
export class PhotographeComponent {
  
}
