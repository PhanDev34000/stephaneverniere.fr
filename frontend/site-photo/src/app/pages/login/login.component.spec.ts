import { TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';
import { fakeAsync, tick } from '@angular/core/testing';

// Fake Router
class MockRouter {
  navigate(commands: any[]) { return commands; }
}

// Fake AuthService
class MockAuthService {
  login(identifiant: string, password: string) {
    return of({ token: 'fake-jwt-token', user: { role: 'client' } });
  }
}

//Test de l'US6

describe('US6 - Formulaire de connexion client', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ],
    }).compileComponents();
  });

  it('doit créer le composant Login', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('le formulaire est invalide si identifiant et mot de passe sont vides', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    const form = { invalid: true } as NgForm;
    const comp = fixture.componentInstance;

    comp.onSubmit(form);
    // pas d’appel au service attendu
    expect(comp.loading).toBeFalse();
  });

  it('appelle AuthService.login() avec identifiant et mot de passe valides', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    const service = TestBed.inject(AuthService);

   spyOn(service, 'login').and.returnValue(
    of({ token: 'fake-jwt-token', user: { role: 'client' } })
  );


    comp.identifiant = 'client@example.com';
    comp.password = 'monpass';

    const form = { invalid: false } as NgForm;
    comp.onSubmit(form);

    expect(service.login).toHaveBeenCalledWith('client@example.com', 'monpass');
  });

  it('met error si AuthService.login() échoue', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);
    const comp = fixture.componentInstance;
    const service = TestBed.inject(AuthService);

    spyOn(service, 'login').and.returnValue(
      throwError(() => ({ error: { message: 'Identifiants invalides' } }))
    );

    comp.identifiant = 'wrong@example.com';
    comp.password = 'badpass';

    const form = { invalid: false } as NgForm;
    comp.onSubmit(form);

    tick(); // ⚡ force la fin de l’Observable

    expect(comp.error).toContain('Identifiants invalides');
  }));

  // Test de l'US7
  it('redirige vers /mon-espace après login client', fakeAsync(() => {
  const fixture = TestBed.createComponent(LoginComponent);
  const comp = fixture.componentInstance;
  const service = TestBed.inject(AuthService);
  const router = TestBed.inject(Router);

  spyOn(service, 'login').and.returnValue(
    of({ token: 'fake-jwt-token', user: { role: 'client' } })
  );
  const navigateSpy = spyOn(router, 'navigate');

  comp.identifiant = 'client@example.com';
  comp.password = 'pass';
  const form = { invalid: false } as NgForm;

  comp.onSubmit(form);
  tick();

  expect(navigateSpy).toHaveBeenCalledWith(['/mon-espace']);
}));

it('redirige vers /admin après login admin', fakeAsync(() => {
  const fixture = TestBed.createComponent(LoginComponent);
  const comp = fixture.componentInstance;
  const service = TestBed.inject(AuthService);
  const router = TestBed.inject(Router);

  spyOn(service, 'login').and.returnValue(
    of({ token: 'fake-jwt-token', user: { role: 'admin' } })
  );
  const navigateSpy = spyOn(router, 'navigate');

  comp.identifiant = 'admin@example.com';
  comp.password = 'pass';
  const form = { invalid: false } as NgForm;

  comp.onSubmit(form);
  tick();

  expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
}));

// Test de l'US10
it('redirige vers /admin après connexion admin', fakeAsync(() => {
  const fixture = TestBed.createComponent(LoginComponent);
  const comp = fixture.componentInstance;
  const service = TestBed.inject(AuthService);
  const router = TestBed.inject(Router);

  spyOn(service, 'login').and.returnValue(
    of({ token: 'fake-jwt-token', user: { role: 'admin' } })
  );
  const navigateSpy = spyOn(router, 'navigate');

  comp.identifiant = 'admin@example.com';
  comp.password = 'adminpass';

  const form = { invalid: false } as NgForm;
  comp.onSubmit(form);
  tick();

  expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
}));

it('affiche une erreur si connexion admin échoue', fakeAsync(() => {
  const fixture = TestBed.createComponent(LoginComponent);
  const comp = fixture.componentInstance;
  const service = TestBed.inject(AuthService);

  spyOn(service, 'login').and.returnValue(
    throwError(() => ({ error: { message: 'Accès refusé' } }))
  );

  comp.identifiant = 'admin@example.com';
  comp.password = 'wrongpass';

  const form = { invalid: false } as NgForm;
  comp.onSubmit(form);
  tick();

  expect(comp.error).toContain('Accès refusé');
}));

});
