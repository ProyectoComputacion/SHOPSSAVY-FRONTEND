import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-recetas',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-recetas.component.html',
  styleUrls: ['./admin-recetas.component.scss']
})
export class AdminRecetasComponent implements OnInit {
  recetas: any[] = [];
  mensaje: string = '';

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.obtenerRecetas();
  }

  obtenerRecetas() {
    this.http.get<any[]>('/api/recipes', this.auth.header()).subscribe({
      next: res => this.recetas = res,
      error: err => console.error('Error al obtener recetas:', err)
    });
  }

  eliminarReceta(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta receta?')) return;

    this.http.delete(`/api/admin/recipes/${id}`, this.auth.header()).subscribe({
      next: () => {
        this.mensaje = 'Receta eliminada correctamente';
        this.recetas = this.recetas.filter(r => r.id !== id);
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error('Error al eliminar receta:', err)
    });
  }
}
