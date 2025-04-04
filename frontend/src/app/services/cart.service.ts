import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartComparison, CartItem } from '../models/cart.models';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:8000/api/cart';
  private userApiUrl = 'http://localhost:8000/api/user'; // URL para obtener el ID del usuario autenticado

  constructor(private http: HttpClient) {}

  // ✅ Función para obtener headers con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth_token'); // Asegúrate de guardar el token en sessionStorage al iniciar sesión
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ✅ Obtener comparación de precios del carrito
  getCartComparison(userId: number): Observable<CartComparison[]> {
    return this.http.get<CartComparison[]>(`${this.apiUrl}/compare/${userId}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Obtener el ID del usuario autenticado
  getAuthenticatedUserId(): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/authenticated`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Obtener el carrito
  getCart(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, {
      headers: this.getHeaders(),
    });
  }
  

  // ✅ Agregar una receta al carrito
  addToCart(userId: number, recipeId: number, recipeType: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, 
      { user_id: userId, recipe_id: recipeId, recipe_type: recipeType },
      { headers: this.getHeaders() }
    );
  }

  // ✅ Eliminar un ítem del carrito
  removeFromCart(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Vaciar el carrito
  clearCart(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`, {
      headers: this.getHeaders(),
    });
  }
}
