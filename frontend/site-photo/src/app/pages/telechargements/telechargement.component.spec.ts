import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TelechargementsComponent } from './telechargements.component';
import { GalleriesService, MyGallery } from '../../services/galleries.service';
import { of, throwError } from 'rxjs';

// Fake service
class MockGalleriesService {
  listMine() { return of([]); }
  downloadZip(id: string) { return of(new Blob()); }
}

// Test US8

describe('US8 - Message de chargement galerie', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelechargementsComponent], // standalone
      providers: [
        { provide: GalleriesService, useClass: MockGalleriesService }
      ]
    }).compileComponents();
  });

 it('affiche un message de chargement quand loading = true', () => {
  const fixture = TestBed.createComponent(TelechargementsComponent);
  const comp = fixture.componentInstance;

  comp.loading.set(true); 
  fixture.detectChanges();

  const el = fixture.nativeElement as HTMLElement;
  expect(el.textContent).toContain('Téléchargement'); 
});


  it('n’affiche pas le message quand loading = false', () => {
    const fixture = TestBed.createComponent(TelechargementsComponent);
    const comp = fixture.componentInstance;

    comp.loading.set(false);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).not.toContain('Chargement de votre galerie');
  });


  // Test US9
  describe('US9 - Téléchargement ZIP', () => {
  let service: GalleriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelechargementsComponent], // standalone
      providers: [
        { provide: GalleriesService, useClass: MockGalleriesService }
      ]
    }).compileComponents();

    service = TestBed.inject(GalleriesService);
  });

  it('appelle GalleriesService.downloadZip() avec le bon id', fakeAsync(() => {
    const fixture = TestBed.createComponent(TelechargementsComponent);
    const comp = fixture.componentInstance;
    const spy = spyOn(service, 'downloadZip').and.returnValue(of(new Blob()));

    const g: MyGallery = { _id: '123', title: 'Mariage', photos: [] } as any;
    comp.downloadZip(g);
    tick();

    expect(spy).toHaveBeenCalledWith('123');
    expect(comp.error()).toBeNull();
    expect(comp.loading()).toBeFalse();
  }));

  it('met error si GalleriesService.downloadZip() échoue', fakeAsync(() => {
    const fixture = TestBed.createComponent(TelechargementsComponent);
    const comp = fixture.componentInstance;
    spyOn(service, 'downloadZip').and.returnValue(
      throwError(() => ({ error: { message: 'Téléchargement impossible' } }))
    );

    const g: MyGallery = { _id: '456', title: 'Portraits', photos: [] } as any;
    comp.downloadZip(g);
    tick();

    expect(comp.error()).toContain('Téléchargement impossible');
    expect(comp.loading()).toBeFalse();
  }));
});
});
