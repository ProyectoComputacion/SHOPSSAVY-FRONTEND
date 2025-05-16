import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfiguracionesComponent } from './admin-configuraciones.component';

describe('AdminConfiguracionesComponent', () => {
  let component: AdminConfiguracionesComponent;
  let fixture: ComponentFixture<AdminConfiguracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConfiguracionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConfiguracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
