import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  categorias: string[] = ["Para cenas rápidas", "Recetas saludables", "Especial para invitados"];
  favoritos: Favorite[] = [];
  filtroCategoria: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarFavoritos();
  }

  cargarFavoritos() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get<Favorite[]>('/api/favorites', { headers }).subscribe(
      (data) => {
        console.log('Favoritos recibidos:', data);
        this.favoritos = data;
      },
      (error) => {
        console.error('Error obteniendo favoritos:', error);
      }
    );
  }

  filtrarFavoritos() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get<Favorite[]>(`/api/favorites?category=${this.filtroCategoria}`, { headers }).subscribe(
      (data) => {
        console.log('Favoritos filtrados:', data);
        this.favoritos = data;
      },
      (error) => {
        console.error('Error filtrando favoritos:', error);
      }
    );
  }

  eliminarFavorito(favoritoId: number) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.delete(`/api/favorites/${favoritoId}`, { headers }).subscribe(
      () => {
        this.favoritos = this.favoritos.filter(fav => fav.id !== favoritoId);
      },
      (error) => console.error('Error eliminando favorito:', error)
    );
  }

  verDetalles(recipeId: number): void {
    this.router.navigate(['/receta-detalle', recipeId]);
  }
}
