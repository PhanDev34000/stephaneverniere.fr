import { TestBed } from '@angular/core/testing';
import { PhotographeComponent } from './photographe.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('US4 - Galerie Photographe', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhotographeComponent,      // standalone
        HttpClientTestingModule,   // fournit HttpClient
        RouterTestingModule        // fournit ActivatedRoute et routerLink
      ],
    }).compileComponents();
  });

  it('doit créer le composant Photographe', () => {
    const fixture = TestBed.createComponent(PhotographeComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('doit afficher une galerie d’images', () => {
    const fixture = TestBed.createComponent(PhotographeComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const images = el.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('chaque image doit avoir un attribut alt', () => {
    const fixture = TestBed.createComponent(PhotographeComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const images = el.querySelectorAll('img');
    images.forEach(img => {
      expect(img.hasAttribute('alt')).toBeTrue();
    });
  });
});
