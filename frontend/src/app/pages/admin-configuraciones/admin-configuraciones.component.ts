import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-configuraciones.component.html',
  styleUrls: ['./admin-configuraciones.component.scss']
})
export class AdminConfiguracionesComponent implements OnInit {
  componentes: any[] = [];
  nuevoComponente = {
    nombre: '',
    valor: ''
  };
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarComponentes();
  }

  cargarComponentes(): void {
    this.http.get('/api/componentes').subscribe({
      next: (res: any) => {
        this.componentes = res;
      },
      error: err => {
        console.error('Error al cargar componentes:', err);
      }
    });
  }

  actualizarComponente(comp: any): void {
    this.http.put(`/api/componentes/${comp.id}`, { valor: comp.valor }).subscribe({
      next: (res: any) => {
        this.mensaje = `Componente "${comp.nombre}" actualizado correctamente`;
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => {
        console.error('Error al actualizar componente:', err);
      }
    });
  }

  crearComponente(): void {
    if (!this.nuevoComponente.nombre || !this.nuevoComponente.valor) {
      this.mensaje = 'Rellena todos los campos.';
      return;
    }

    this.http.post('/api/componentes', this.nuevoComponente).subscribe({
      next: (res: any) => {
        this.mensaje = 'Componente creado correctamente';
        this.nuevoComponente = { nombre: '', valor: '' };
        this.cargarComponentes();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => {
        console.error('Error al crear componente:', err);
      }
    });
  }

  eliminarComponente(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este componente?')) return;

    this.http.delete(`/api/componentes/${id}`).subscribe({
      next: () => {
        this.mensaje = 'Componente eliminado';
        this.componentes = this.componentes.filter(c => c.id !== id);
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => {
        console.error('Error al eliminar componente:', err);
      }
    });
  }
}
