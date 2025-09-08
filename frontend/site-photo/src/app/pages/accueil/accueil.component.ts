import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhotosService } from '../../services/photos.service';
import { FilmStripComponent } from '../../component/film-strip/film-strip.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterLink, FilmStripComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
  nbPhotos = 0;

 
}
