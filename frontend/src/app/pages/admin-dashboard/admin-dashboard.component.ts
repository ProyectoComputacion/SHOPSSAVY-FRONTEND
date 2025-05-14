import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  estadisticas: any = {};
  configuraciones: any[] = [];
  nuevaConfig = { clave: '', valor: '' };
  mensaje: string = '';

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarConfiguraciones();
  }

  cargarEstadisticas() {
    this.http.get('/api/admin/stats', this.auth.header()).subscribe({
      next: res => this.estadisticas = res,
      error: err => console.error("Error cargando estadísticas:", err)
    });
  }

  cargarConfiguraciones() {
    this.http.get<any[]>('/api/admin/config', this.auth.header()).subscribe({
      next: res => this.configuraciones = res,
      error: err => console.error("Error cargando configuraciones:", err)
    });
  }

  guardarConfiguracion() {
    this.http.post('/api/admin/config', this.nuevaConfig, this.auth.header()).subscribe({
      next: (res: any) => {
        this.mensaje = res.message;
        this.nuevaConfig = { clave: '', valor: '' };
        this.cargarConfiguraciones();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error("Error guardando configuración:", err)
    });
  }
}
