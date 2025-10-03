import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AdminGalleriesComponent } from './admin-galleries.component';
import { GalleriesService } from '../../services/galleries.service';
import { ClientsService } from '../../services/clients.services';

// Fake ClientsService
class MockClientsService {
  list() { return of([]); }
}

// Fake GalleriesService
class MockGalleriesService {
  list() { return of([]); }
  create(dto: any) { return of({ _id: 'gal1', ...dto }); }
  uploadFiles() { return of({ _id: 'gal1', title: 'Mariage', clientId: '123' }); }
  update() { return of({ _id: 'gal1', title: 'Mariage', clientId: '123' }); }
  delete() { return of(void 0); }
  downloadZip() { return of(new Blob()); }
}

describe('US13 - AdminGalleriesComponent', () => {
  let galleriesService: GalleriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AdminGalleriesComponent],
      providers: [
        { provide: GalleriesService, useClass: MockGalleriesService },
        { provide: ClientsService, useClass: MockClientsService }  // ✅ ajout
      ]
    }).compileComponents();

    galleriesService = TestBed.inject(GalleriesService);
  });

  it('doit créer le composant', () => {
    const fixture = TestBed.createComponent(AdminGalleriesComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('form invalide si vide', () => {
    const fixture = TestBed.createComponent(AdminGalleriesComponent);
    const comp = fixture.componentInstance;
    fixture.detectChanges();
    expect(comp.form.valid).toBeFalse();
  });

  it('appelle GalleriesService.create() si form valide', () => {
    const fixture = TestBed.createComponent(AdminGalleriesComponent);
    const comp = fixture.componentInstance;
    const spy = spyOn(galleriesService, 'create').and.callThrough();

    comp.form.controls['clientId'].setValue('123');
    comp.form.controls['title'].setValue('Mariage');

    comp.create();

    expect(spy).toHaveBeenCalledWith({
      clientId: '123',
      title: 'Mariage'
    });
    expect(comp.success()).toContain('Galerie créée.');
  });

  it('affiche une erreur si GalleriesService.create() échoue', () => {
    const fixture = TestBed.createComponent(AdminGalleriesComponent);
    const comp = fixture.componentInstance;
    const spy = spyOn(galleriesService, 'create').and.returnValue(
      throwError(() => ({ error: { message: 'Erreur Cloudinary/Cloudflare' } }))
    );

    comp.form.controls['clientId'].setValue('123');
    comp.form.controls['title'].setValue('Mariage');

    comp.create();

    expect(spy).toHaveBeenCalled();
    expect(comp.error()).toContain('Erreur Cloudinary/Cloudflare');
  });
});
