import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';
import { ContactService, ContactDto } from '../../services/contact.service';

// Fake service pour tester
class MockContactService {
  envoyer(dto: ContactDto) {
    return of({}); // simule un succès
  }
}

describe('US5 - Formulaire de contact', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule],
      providers: [
        { provide: ContactService, useClass: MockContactService } // ✅ fake service
      ],
    }).compileComponents();
  });

  it('doit créer le composant Contact', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('le formulaire doit être invalide si vide', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    expect(comp.form.valid).toBeFalse();
  });

  it('le formulaire devient valide avec tous les champs obligatoires', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.form.controls['nom'].setValue('Dupont');
    comp.form.controls['prenom'].setValue('Jean');
    comp.form.controls['mail'].setValue('test@example.com');
    comp.form.controls['message'].setValue('Bonjour, ceci est un test');
    comp.form.controls['messagePour'].setValue('photographe');

    expect(comp.form.valid).toBeTrue();
  });

  it('appelle ContactService.envoyer() quand on soumet le formulaire valide', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    const service = TestBed.inject(ContactService);
    spyOn(service, 'envoyer').and.returnValue(of({})); // espion

    comp.form.controls['nom'].setValue('Dupont');
    comp.form.controls['prenom'].setValue('Jean');
    comp.form.controls['mail'].setValue('test@example.com');
    comp.form.controls['message'].setValue('Bonjour, ceci est un test');
    comp.form.controls['messagePour'].setValue('photographe');

    comp.submit();

    expect(service.envoyer).toHaveBeenCalled();
  });

  it('gère une erreur renvoyée par ContactService', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    const comp = fixture.componentInstance;
    const service = TestBed.inject(ContactService);
    spyOn(service, 'envoyer').and.returnValue(throwError(() => ({ error: { message: 'Erreur serveur' } })));

    comp.form.controls['nom'].setValue('Dupont');
    comp.form.controls['prenom'].setValue('Jean');
    comp.form.controls['mail'].setValue('test@example.com');
    comp.form.controls['message'].setValue('Bonjour');
    comp.form.controls['messagePour'].setValue('photographe');

    comp.submit();

    expect(comp.error()).toContain('Erreur serveur');
  });
});
