import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecetasComponent } from './recetas.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { RecetaService } from '../../services/receta.service';
import { of } from 'rxjs';
import { Recipe } from '../../services/receta.service';

describe('RecetasComponent', () => {
  let component: RecetasComponent;
  let fixture: ComponentFixture<RecetasComponent>;
  const mockService = {
    getRecetas: jasmine.createSpy('getRecetas').and.returnValue(of([])),
    getCategorias: jasmine.createSpy('getCategorias').and.returnValue(of(['a', 'b'])),
    getTipos: jasmine.createSpy('getTipos').and.returnValue(of(['x', 'y']))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecetasComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [{ provide: RecetaService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(RecetasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('al ocultar el modal limpia backdrop y overflow', fakeAsync(() => {
    // 1) Preparamos un elemento dummy para el modal y lo añadimos al DOM
    const modalEl = document.createElement('div');
    modalEl.id = 'modalCategoriaFavorito';
    document.body.appendChild(modalEl);

    // 2) Abrimos el modal pasando un Recipe válido (casteado)
    component.abrirModalCategoria({} as Recipe);

    // 3) Simulamos que Bootstrap dispara el evento 'hidden.bs.modal'
    modalEl.dispatchEvent(new Event('hidden.bs.modal'));
    tick();

    // 4) Comprobamos que el overflow del body se ha restaurado
    expect(document.body.style.overflow).toBe('');
    // 5) Y que no quedan backdrops en el DOM
    expect(document.querySelectorAll('.modal-backdrop').length).toBe(0);

    // 6) Limpieza
    document.body.removeChild(modalEl);
  }));
});
