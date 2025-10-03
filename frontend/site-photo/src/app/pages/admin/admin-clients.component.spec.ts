import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminClientsComponent } from './admin-clients.component';
import { ClientsService } from '../../services/clients.services';

// Fake service
class MockClientsService {
  list() { return of([]); }
  create(dto: any) { return of({ _id: '1', ...dto }); }
  update() { return of({}); }
  updatePassword() { return of({}); }
  delete() { return of({}); }
}

describe('US11 - Création de compte client', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AdminClientsComponent],
      providers: [
        { provide: ClientsService, useClass: MockClientsService }
      ]
    }).compileComponents();
  });

  it('doit créer le composant AdminClients', () => {
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('le formulaire est invalide si vide', () => {
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    expect(comp.form.valid).toBeFalse();
  });

  it('le formulaire devient valide si tous les champs obligatoires sont remplis', () => {
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.form.controls['identifiant'].setValue('client1');
    comp.form.controls['password'].setValue('password123');

    expect(comp.form.valid).toBeTrue();
  });

  it('appelle ClientsService.create() à la soumission d’un formulaire valide', () => {
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    const service = TestBed.inject(ClientsService);
    spyOn(service, 'create').and.returnValue(of({ _id: '1', identifiant: 'client1', password: 'password123' }));

    comp.form.controls['identifiant'].setValue('client1');
    comp.form.controls['password'].setValue('password123');

    comp.create();

    expect(service.create).toHaveBeenCalledWith({
      identifiant: 'client1',
      email: '',
      password: 'password123'
    });
    expect(comp.success()).toContain('Client créé.');
  });

  it('affiche une erreur si ClientsService.create() échoue', () => {
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    const service = TestBed.inject(ClientsService);
    spyOn(service, 'create').and.returnValue(
      throwError(() => ({ error: { message: 'Erreur serveur' } }))
    );

    comp.form.controls['identifiant'].setValue('client1');
    comp.form.controls['password'].setValue('password123');

    comp.create();

    expect(comp.error()).toContain('Erreur serveur');
  });

  // US12
  describe('US12 - Modification et suppression de compte client', () => {
  let service: ClientsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AdminClientsComponent],
      providers: [
        { provide: ClientsService, useClass: MockClientsService }
      ]
    }).compileComponents();

    service = TestBed.inject(ClientsService);
  });

  it('appelle ClientsService.update() et met à jour la liste', () => {
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    spyOn(service, 'update').and.returnValue(of({ _id: '123', identifiant: 'updatedClient' }));

    // Simule un client existant
    comp.clients.set([{ _id: '123', identifiant: 'oldClient', email: '', isActive: true } as any]);
    comp.editBuffer = { identifiant: 'updatedClient', email: '' };

    comp.save({ _id: '123', identifiant: 'oldClient', email: '', isActive: true } as any);

    expect(service.update).toHaveBeenCalledWith('123', { identifiant: 'updatedClient', email: '' });
    expect(comp.success()).toContain('Client mis à jour.');
    expect(comp.clients()[0].identifiant).toBe('updatedClient');
  });

  it('appelle ClientsService.delete() et retire le client de la liste', () => {
    spyOn(window, 'confirm').and.returnValue(true); // simule un "OK" au confirm
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    spyOn(service, 'delete').and.returnValue(of(void 0));

    // Simule 2 clients
    comp.clients.set([
      { _id: '123', identifiant: 'client1', email: '', isActive: true } as any,
      { _id: '456', identifiant: 'client2', email: '', isActive: true } as any,
    ]);

    comp.remove({ _id: '123', identifiant: 'client1', email: '', isActive: true } as any);

    expect(service.delete).toHaveBeenCalledWith('123');
    expect(comp.success()).toContain('Client supprimé.');
    expect(comp.clients().length).toBe(1);
    expect(comp.clients()[0]._id).toBe('456');
  });

  it('n’appelle pas ClientsService.delete() si confirm est annulé', () => {
    spyOn(window, 'confirm').and.returnValue(false); // simulate cancel
    const fixture = TestBed.createComponent(AdminClientsComponent);
    const comp = fixture.componentInstance;
    const spy = spyOn(service, 'delete');

    comp.remove({ _id: '123', identifiant: 'client1', email: '', isActive: true } as any);

    expect(spy).not.toHaveBeenCalled();
  });
});
});
