import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { RecetaService, Recipe } from '../../services/receta.service';

declare var bootstrap: any; // Para manejar el modal de Bootstrap

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.scss']
})
export class RecetasComponent implements OnInit {
  recetasFiltradas: Recipe[] = [];
  categorias: string[] = [];
  tipos: string[] = [];
  filtroCategoria: string = '';
  filtroTipo: string = '';

  // Para controlar el modal de favoritos
  recetaSeleccionada!: Recipe;
  private modalCategoriaFavorito: any;

  constructor(
    private recetaService: RecetaService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.obtenerRecetas();
    this.obtenerCategorias();
    this.obtenerTipos();
  }

  obtenerRecetas(): void {
    const tipoCorrecto =
      this.filtroTipo === 'Normales'
        ? 'Recetas'
        : this.filtroTipo === 'Michelin'
        ? 'Recetas Michelin'
        : '';

    this.recetaService.getRecetas(this.filtroCategoria, tipoCorrecto).subscribe(
      (data: Recipe[]) => {
        this.recetasFiltradas = data;
      },
      (error: any) => {
        console.error('Error obteniendo recetas:', error);
      }
    );
  }

  obtenerCategorias(): void {
    this.recetaService.getCategorias().subscribe(
      (data: string[]) => {
        this.categorias = data;
      },
      (error: any) => {
        console.error('Error obteniendo categorías:', error);
      }
    );
  }

  obtenerTipos(): void {
    this.recetaService.getTipos().subscribe(
      (data: string[]) => {
        this.tipos = data;
      },
      (error: any) => {
        console.error('Error obteniendo tipos de recetas:', error);
      }
    );
  }

  filtrarRecetas(): void {
    this.obtenerRecetas();
  }

  verDetalles(id: number): void {
    console.log("Redirigiendo a receta con ID:", id);
    this.router.navigate(['/receta-detalle', id]);
  }

  /**
   * Abre el modal con las imágenes para elegir la categoría.
   */
  abrirModalCategoria(receta: Recipe): void {
    this.recetaSeleccionada = receta;
    const modalElement = document.getElementById('modalCategoriaFavorito');
    if (modalElement) {
      this.modalCategoriaFavorito = new bootstrap.Modal(modalElement);
      this.modalCategoriaFavorito.show();
    }
  }

  /**
   * Al hacer clic en una de las imágenes, se crea el favorito con esa categoría.
   * El modal se cierra inmediatamente al seleccionar la categoría.
   */
  seleccionarCategoria(category: string): void {
    console.log('Categoría seleccionada:', category);
    // Cierra el modal inmediatamente
    if (this.modalCategoriaFavorito) {
      this.modalCategoriaFavorito.hide();
    }
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );

    const body = {
      recipe_id: this.recetaSeleccionada.id,
      category: category
    };

    // Ajusta la URL /api/favorites según tu API
    this.http.post('/api/favorites', body, { headers }).subscribe(
      (res) => {
        console.log('Favorito creado:', res);
      },
      (err) => {
        console.error('Error añadiendo favorito:', err);
      }
    );
  }
}
