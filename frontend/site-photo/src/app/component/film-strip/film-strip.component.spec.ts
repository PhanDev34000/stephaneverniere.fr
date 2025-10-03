import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilmStripComponent } from './film-strip.component';
import { PhotosService } from '../../services/photos.service';
import { of } from 'rxjs';

describe('US17 - Attribut alt sur les photos', () => {
  let fixture: ComponentFixture<FilmStripComponent>;
  let component: FilmStripComponent;
  let mockPhotosService: jasmine.SpyObj<PhotosService>;

  beforeEach(async () => {
    mockPhotosService = jasmine.createSpyObj('PhotosService', ['byFolder']);

    await TestBed.configureTestingModule({
      imports: [FilmStripComponent],
      providers: [
        { provide: PhotosService, useValue: mockPhotosService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilmStripComponent);
    component = fixture.componentInstance;
    component.folder = 'test-folder'; //  requis par @Input
  });

  it('chaque image rendue doit avoir un attribut alt non vide', () => {
    // Arrange → mock du service
    mockPhotosService.byFolder.and.returnValue(
      of({
        items: [
          {
            urls: { sm: 'sm1.jpg', md: 'md1.jpg' },
            context: { custom: { alt: 'Mariage à Montpellier' } }
          },
          {
            urls: { sm: 'sm2.jpg', md: 'md2.jpg' },
            context: { custom: { alt: 'Soirée Photobooth' } }
          }
        ]
      }as any)
    );

    // Act
    fixture.detectChanges();

    // Assert
    const imgs: HTMLImageElement[] = fixture.nativeElement.querySelectorAll('img');
    expect(imgs.length).toBe(2);
    imgs.forEach(img => {
      expect(img.getAttribute('alt')).toBeTruthy();
    });
  });

  it('si pas de alt Cloudinary, applique un alt par défaut', () => {
    mockPhotosService.byFolder.and.returnValue(
      of({
        items: [
          {
            urls: { sm: 'sm3.jpg', md: 'md3.jpg' },
            context: {} // pas de alt
          }
        ]
      }as any)
    );

    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.getAttribute('alt')).toBe('Photo Stéphane Vernière');
  });
});
