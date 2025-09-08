import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotosService, Photo } from '../../services/photos.service';

@Component({
  selector: 'app-film-strip2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-strip2.component.html',
  styleUrls: ['./film-strip2.component.scss']
})
export class FilmStrip2Component {
  @Input({ required: true }) folder!: string;     // ex: 'prestations/Portrait'
  @Input() limit = 30;
  @Input() shuffle = false;
  @Input() title = '';

  // Nouveaux contrôles :
  @Input() widthPercent = 80;                     // largeur du carrousel (80% par défaut)
  @Input() background: 'primary' | 'secondary' = 'secondary'; // fond du bandeau

  items: Photo[] = [];
  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLDivElement>;

  constructor(private api: PhotosService) {}

  ngOnInit() {
    this.api.byFolder(this.folder, this.limit).subscribe(({ items }) => {
      this.items = this.shuffle ? items.sort(() => Math.random() - 0.5) : items;
    });
  }

  prev() { this.rail.nativeElement.scrollBy({ left: -600, behavior: 'smooth' }); }
  next() { this.rail.nativeElement.scrollBy({ left:  600, behavior: 'smooth' }); }
}
