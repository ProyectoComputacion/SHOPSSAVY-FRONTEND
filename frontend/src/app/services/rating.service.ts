import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private apiUrl = 'http://localhost:8000/api/ratings'; // URL de tu backend Laravel

  constructor(private http: HttpClient) {}

  enviarCalificacion(user_id: number, recipe_id: number, rating: number): Observable<any> {
    const data = {
      user_id,
      recipe_id,
      rating,
    };

    return this.http.post(this.apiUrl, data);
  }
  getTopRatedRecipes(): Observable<any> {
    return this.http.get('http://localhost:8000/api/ratings/top');
  }
  
}
