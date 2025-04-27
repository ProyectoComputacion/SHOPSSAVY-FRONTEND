import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritosComponent } from './favoritos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('FavoritosComponent', () => {
  let component: FavoritosComponent;
  let fixture: ComponentFixture<FavoritosComponent>;
  const mockFavorites = [
    {
      id: 1,
      user_id: 1,
      recipe_id: 10,
      category: 'Para cenas rápidas',
      recipe: { id: 10, name: 'Tostadas', imagen: '' }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritosComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritosComponent);
    component = fixture.componentInstance;
    spyOn(component['http'], 'get').and.returnValue(of(mockFavorites));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cargarFavoritos debe poblar favoritos', () => {
    component.cargarFavoritos();
    expect(component.favoritos).toEqual(mockFavorites);
  });

  it('filtrarFavoritos debe aplicar filtro', () => {
    spyOn(component['http'], 'get').and.returnValue(of([]));
    component.filtrarFavoritos('Recetas saludables');
    expect(component.filtroCategoria).toBe('Recetas saludables');
  });

  it('eliminarFavorito debe quitar item', () => {
    component.favoritos = mockFavorites.slice();
    spyOn(component['http'], 'delete').and.returnValue(of({}));
    component.eliminarFavorito(1);
    expect(component.favoritos.length).toBe(0);
  });
});
