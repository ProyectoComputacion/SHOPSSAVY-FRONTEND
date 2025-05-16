import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-estadisticas.component.html',
  styleUrls: ['./admin-estadisticas.component.scss']
})
export class EstadisticasComponent implements OnInit {
  estadisticas: any = {};

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.http.get('/api/admin/stats', this.auth.header()).subscribe({
      next: res => this.estadisticas = res,
      error: err => console.error("Error cargando estadísticas:", err)
    });
  }
}
