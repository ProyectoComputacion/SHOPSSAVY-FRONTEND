import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

declare const bootstrap: any;

interface Favorite {
  id: number;
  user_id: number;
  recipe_id: number;
  category: string;
  recipe: {
    id: number;
    name: string;
    imagen: string;
  };
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  categorias = ['Para cenas rápidas', 'Recetas saludables', 'Especial para invitados'];
  favoritos: Favorite[] = [];
  filtroCategoria = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    this.http
      .get<Favorite[]>('/api/favorites', { headers })
      .subscribe(data => (this.favoritos = data));
  }

  filtrarFavoritos(categoria: string) {
    this.filtroCategoria = categoria;
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    const params = categoria ? `?category=${categoria}` : '';
    this.http
      .get<Favorite[]>(`/api/favorites${params}`, { headers })
      .subscribe(data => (this.favoritos = data));
  }

  eliminarFavorito(favoritoId: number) {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    this.http.delete(`/api/favorites/${favoritoId}`, { headers }).subscribe(() => {
      this.favoritos = this.favoritos.filter(f => f.id !== favoritoId);
    });
  }

  verDetalles(recipeId: number): void {
    this.router.navigate(['/receta-detalle', recipeId]);
  }

  verReceta(): void {
    this.router.navigate(['/recetas']);
  }
}
