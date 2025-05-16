import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarRecetasPorCategoria();
    this.cargarUsuariosPorRol();
    this.cargarRecetasTop();
  }

  cargarRecetasPorCategoria() {
    this.http.get<any[]>('/api/recipes').subscribe(data => {
      const categorias: { [key: string]: number } = {};
      data.forEach(r => {
        categorias[r.category] = (categorias[r.category] || 0) + 1;
      });

      const labels = Object.keys(categorias);
      const valores = Object.values(categorias);

      new Chart('recetasPorCategoria', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Recetas por categoría',
            data: valores,
          }]
        }
      });
    });
  }

  cargarUsuariosPorRol() {
    this.http.get<any[]>('/api/users').subscribe(data => {
      const roles: { [key: string]: number } = {};
      data.forEach(u => {
        roles[u.role] = (roles[u.role] || 0) + 1;
      });

      new Chart('usuariosPorRol', {
        type: 'doughnut',
        data: {
          labels: Object.keys(roles),
          datasets: [{
            label: 'Usuarios por rol',
            data: Object.values(roles),
          }]
        }
      });
    });
  }

  cargarRecetasTop() {
    this.http.get<any[]>('/api/ratings/top').subscribe(data => {
      const labels = data.map(d => d.recipe.name);
      const valores = data.map(d => d.avg_rating);

      new Chart('recetasTop', {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Mejor Calificadas',
            data: valores,
          }]
        }
      });
    });
  }
}
