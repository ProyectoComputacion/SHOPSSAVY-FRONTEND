import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = 'http://localhost:8000/api'; // Ajusta la URL a tu backend

  constructor(private http: HttpClient) {}

  /**
   * Llama a /api/menu-generator?budget=xx
   * para obtener 14 recetas (y su total) según el presupuesto
   */
  generateMenu(budget: number): Observable<any> {
    const params = new HttpParams().set('budget', budget.toString());
    return this.http.get<any>(`${this.baseUrl}/menu-generator`, { params });
  }
}
