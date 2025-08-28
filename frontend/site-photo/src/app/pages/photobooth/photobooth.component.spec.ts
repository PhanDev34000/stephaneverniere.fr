import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoboothComponent } from './photobooth.component';

describe('PhotoboothComponent', () => {
  let component: PhotoboothComponent;
  let fixture: ComponentFixture<PhotoboothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoboothComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoboothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
