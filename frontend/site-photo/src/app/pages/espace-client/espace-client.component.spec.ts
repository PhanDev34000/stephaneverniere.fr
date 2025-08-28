import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceClientComponent } from './espace-client.component';

describe('EspaceClientComponent', () => {
  let component: EspaceClientComponent;
  let fixture: ComponentFixture<EspaceClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspaceClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
