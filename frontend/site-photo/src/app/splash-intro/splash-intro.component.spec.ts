import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SplashIntroComponent } from './splash-intro.component';

describe('US2 - Page d’accueil animée', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SplashIntroComponent],
    }).compileComponents();
  });

 it('doit afficher le texte de bienvenue au chargement', () => {
  const fixture = TestBed.createComponent(SplashIntroComponent);
  const component = fixture.componentInstance;

  // On force l’affichage du texte
  spyOn(component, 'showText').and.returnValue(true);

  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;

  expect(el.querySelector('h1')?.textContent)
    .toContain('Bienvenue sur le site de Stéphane Vernière');
  expect(el.querySelector('h5')?.textContent)
    .toContain('Photographe et Photobooth');
});


  it('doit rediriger vers accueil après 4 secondes', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    const fixture = TestBed.createComponent(SplashIntroComponent);
    fixture.detectChanges();

    tick(4000);

    expect(navigateSpy).toHaveBeenCalledWith(['accueil']);
  }));
});
