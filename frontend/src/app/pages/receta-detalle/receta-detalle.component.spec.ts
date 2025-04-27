import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecetaDetalleComponent } from './receta-detalle.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { RecetaService } from '../../services/receta.service';

describe('RecetaDetalleComponent', () => {
  let component: RecetaDetalleComponent;
  let fixture: ComponentFixture<RecetaDetalleComponent>;
  const mockService = {
    getReceta: jasmine.createSpy('getReceta').and.returnValue(of({
      id: 1, name: 'Test', imagen: '', tipo: 'Recetas', created_at: '', updated_at: '', category: ''
    })),
    getIngredientes: jasmine.createSpy('getIngredientes').and.returnValue(of([]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaDetalleComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map([['id','1']]) } } },
        { provide: RecetaService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecetaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockService.getReceta).toHaveBeenCalledWith(1);
    expect(component.recetaCargada).toBeTrue();
  });
});
