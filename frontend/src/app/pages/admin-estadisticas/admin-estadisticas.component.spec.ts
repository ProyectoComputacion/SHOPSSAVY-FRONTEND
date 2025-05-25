import { ComponentFixture, TestBed } from '@angular/core/testing';

// Make sure the file 'estadisticas.component.ts' exists in the same directory as this spec file.
// If the file is named differently or in another folder, update the import path accordingly.
import { EstadisticasComponent } from './admin-estadisticas.component';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstadisticasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
