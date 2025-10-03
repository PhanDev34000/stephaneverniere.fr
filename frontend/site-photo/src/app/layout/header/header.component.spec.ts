import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Stubs pour les pages
@Component({ template: '' }) class AccueilStub {}
@Component({ template: '' }) class PhotographeStub {}
@Component({ template: '' }) class PhotoboothStub {}
@Component({ template: '' }) class ContactStub {}

describe('US3 - Navigation entre pages', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'accueil', component: AccueilStub },
          { path: 'photographe', component: PhotographeStub },
          { path: 'photobooth', component: PhotoboothStub },
          { path: 'contact', component: ContactStub },
        ]),
        HttpClientTestingModule, // pour mocker HttpClient
        HeaderComponent,
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
  });

  it('doit contenir les liens de navigation', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('Accueil');
    expect(el.textContent).toContain('Photographe');
    expect(el.textContent).toContain('Photobooth');
    expect(el.textContent).toContain('Contact');
  });

  it('navigue vers /photographe quand on clique sur le lien', async () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const link = el.querySelector('a[href="/photographe"]') as HTMLAnchorElement;
    link.click();

    await fixture.whenStable();
    expect(location.path()).toBe('/photographe');
  });
});
