import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotosService, Photo } from '../../services/photos.service';


@Component({
  selector: 'app-film-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './film-strip.component.html',
  styleUrls: ['./film-strip.component.scss']
})
export class FilmStripComponent {
  @Input({ required: true }) folder!: string;      
  @Input() limit = 30;
  @Input() shuffle = false;
  @Input() title = '';

  items: Photo[] = [];
  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLDivElement>;

  constructor(private api: PhotosService) {}

  ngOnInit() {
    this.api.byFolder(this.folder, this.limit).subscribe(({ items }) => {
      this.items = this.shuffle ? items.sort(() => Math.random() - 0.5) : items;
    });
  }

  prev() {
    const img = this.rail.nativeElement.querySelector('img');
    if (img) {
      const w = img.clientWidth + 8; // largeur image + gap (8px)
      this.rail.nativeElement.scrollBy({ left: -w, behavior: 'smooth' });
    }
  }

  next() {
    const img = this.rail.nativeElement.querySelector('img');
    if (img) {
      const w = img.clientWidth + 8;
      this.rail.nativeElement.scrollBy({ left: w, behavior: 'smooth' });
    }
  }

}
