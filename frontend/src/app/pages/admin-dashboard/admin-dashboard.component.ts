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
  usuarios: any[] = [];
  recetas: any[] = [];
  roles: string[] = ['user', 'chef', 'admin'];
  nuevaConfig = { clave: '', valor: '' };
  mensaje: string = '';

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarConfiguraciones();
    this.obtenerUsuarios();
    this.obtenerRecetas();
  }

  cargarEstadisticas() {
    this.http.get('/api/admin/stats').subscribe({
      next: res => this.estadisticas = res,
      error: err => console.error("Error cargando estadísticas:", err)
    });
  }

  cargarConfiguraciones() {
    this.http.get<any[]>('/api/admin/config').subscribe({
      next: res => this.configuraciones = res,
      error: err => console.error("Error cargando configuraciones:", err)
    });
  }

  guardarConfiguracion() {
    this.http.post('/api/admin/config', this.nuevaConfig).subscribe({
      next: (res: any) => {
        this.mensaje = res.message;
        this.nuevaConfig = { clave: '', valor: '' };
        this.cargarConfiguraciones();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error("Error guardando configuración:", err)
    });
  }

  obtenerUsuarios() {
    this.http.get<any[]>('/api/users').subscribe({
      next: res => {
        this.usuarios = res.map(u => ({ ...u, nuevoRol: u.role }));
      },
      error: err => console.error('Error al obtener usuarios:', err)
    });
  }

  cambiarRol(usuario: any) {
    const payload = { role: usuario.nuevoRol };
    this.http.put(`/api/admin/users/${usuario.id}/role`, payload).subscribe({
      next: (res: any) => {
        this.mensaje = 'Rol actualizado correctamente';
        usuario.role = usuario.nuevoRol;
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error('Error actualizando rol:', err)
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.http.delete(`/api/admin/users/${id}`).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado correctamente';
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error('Error al eliminar usuario:', err)
    });
  }

  obtenerRecetas() {
    this.http.get<any[]>('/api/recipes').subscribe({
      next: res => this.recetas = res,
      error: err => console.error('Error al obtener recetas:', err)
    });
  }

  eliminarReceta(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta receta?')) return;

    this.http.delete(`/api/admin/recipes/${id}`).subscribe({
      next: () => {
        this.mensaje = 'Receta eliminada correctamente';
        this.recetas = this.recetas.filter(r => r.id !== id);
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error('Error al eliminar receta:', err)
    });
  }
}
