import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comparacion',
  standalone: true,
  imports: [CommonModule, RouterModule],  
  templateUrl: './clasificados.component.html',
  styleUrls: ['./clasificados.component.scss']
})
export class ClasificadosComponent implements OnInit {
  recetasTop: any[] = [];

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.ratingService.getTopRatedRecipes().subscribe({
      next: (data) => {
        this.recetasTop = data;
        console.log('Recetas mejor valoradas:', data);
      },
      error: (error) => {
        console.error('Error al cargar las recetas top:', error);
      }
    });
  }
}
