import { TestBed } from '@angular/core/testing';
// ⚠️ Adapte l'import au vrai nom de ton composant racine (AppComponent ou AppComponent2)
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('US1 - Accès au site', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 👇 Standalone => on l’importe ici, pas dans declarations
      imports: [AppComponent, RouterTestingModule],
    }).compileComponents();
  });

  it('doit créer le composant principal', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('doit contenir un <router-outlet>', () => {
  const fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges();
  const el = fixture.nativeElement as HTMLElement;
  expect(el.querySelector('router-outlet')).toBeTruthy();
});

});
