import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EspaceAdminComponent } from './espace-admin.component';

describe('EspaceAdminComponent', () => {
  let component: EspaceAdminComponent;
  let fixture: ComponentFixture<EspaceAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,EspaceAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspaceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
