import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 📌 Interfaz para definir los ingredientes
export interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  recipe_id: number;
}

// 📌 Interfaz para definir las recetas
export interface Recipe {
  id: number;
  name: string;
  category: string;
  tipo: string;
  imagen: string; // Propiedad para la imagen
  created_at: string;
  updated_at: string;
}

// 📌 Interfaz para definir favoritos
export interface Favorite {
  id: number;
  user_id: number;
  recipe_id: number;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private apiUrl = 'http://127.0.0.1:8000/api/recipes';
  private favoritesUrl = 'http://127.0.0.1:8000/api/favorites';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Obtiene todas las recetas con filtros opcionales.
   */
  getRecetas(categoria: string = '', tipo: string = ''): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      map((recetas: Recipe[]) => {
        return recetas.filter((receta: Recipe) => {
          const coincideCategoria = categoria ? receta.category.toLowerCase() === categoria.toLowerCase() : true;
          const coincideTipo = tipo ? receta.tipo.toLowerCase() === tipo.toLowerCase() : true;
          return coincideCategoria && coincideTipo;
        });
      })
    );
  }

  /**
   * ✅ Obtiene una receta por su ID.
   */
  getReceta(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  /**
   * ✅ Obtiene los ingredientes de una receta específica.
   */
  getIngredientes(recipeId: number): Observable<Ingredient[]> {
    return this.http.get<any>(`${this.apiUrl}/${recipeId}/ingredients`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (response.ingredients) {
          return response.ingredients;
        } else if (response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  /**
   * ✅ Obtiene la lista de categorías únicas desde la API de recetas.
   */
  getCategorias(): Observable<string[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      map((recetas: Recipe[]) => {
        const categorias = recetas.map((receta: Recipe) => receta.category.toLowerCase());
        return Array.from(new Set(categorias)); // Quita duplicados
      })
    );
  }

  /**
   * ✅ Obtiene la lista de tipos únicos desde la API de recetas.
   */
  getTipos(): Observable<string[]> {
    return this.http.get<Recipe[]>(this.apiUrl).pipe(
      map((recetas: Recipe[]) => {
        const tipos = recetas.map((receta: Recipe) => {
          return receta.tipo === 'Recetas' ? 'Normales' :
                 receta.tipo === 'Recetas Michelin' ? 'Michelin' :
                 receta.tipo.toLowerCase();
        });
        return Array.from(new Set(tipos)); // Quita duplicados
      })
    );
  }

  /**
   * ✅ Obtiene la lista de recetas favoritas del usuario.
   */
  getFavoritos(categoria: string = ''): Observable<Favorite[]> {
    const url = categoria ? `${this.favoritesUrl}?category=${categoria}` : this.favoritesUrl;
    return this.http.get<Favorite[]>(url);
  }

  /**
   * ✅ Agrega una receta a favoritos con una categoría.
   */
  agregarFavorito(recipeId: number, categoria: string): Observable<any> {
    return this.http.post(this.favoritesUrl, { recipe_id: recipeId, category: categoria });
  }

  /**
   * ✅ Elimina una receta de favoritos.
   */
  eliminarFavorito(favoritoId: number): Observable<any> {
    return this.http.delete(`${this.favoritesUrl}/${favoritoId}`);
  }

  /**
   * ✅ Obtiene la lista de productos.
   */
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`http://127.0.0.1:8000/api/productos`);
  }

  /**
   * ✅ Crea una nueva receta.
   */
  crearReceta(receta: any): Observable<any> {
    return this.http.post(this.apiUrl, receta);
  }
}
