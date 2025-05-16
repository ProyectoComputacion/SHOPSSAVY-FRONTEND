import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponenteService } from 'src/app/services/componente.service';

@Component({
  selector: 'app-admin-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-configuraciones.component.html',
  styleUrls: ['./admin-configuraciones.component.scss']
})
export class AdminConfiguracionesComponent implements OnInit {
  estilos: { [clave: string]: string } = {};
  mensaje: string = '';

  colores = [
    { valor: '#ffffff', nombre: 'Blanco' },
    { valor: '#faf1e6', nombre: 'Beige' },
    { valor: '#f0f0f0', nombre: 'Gris claro' },
    { valor: '#343a40', nombre: 'Oscuro' },
    { valor: '#007bff', nombre: 'Azul' },
    { valor: '#ff8c42', nombre: 'Naranja' }
  ];

  tamanos = [
    { valor: 'sm', nombre: 'Pequeño' },
    { valor: 'md', nombre: 'Mediano' },
    { valor: 'lg', nombre: 'Grande' }
  ];

  constructor(private componenteService: ComponenteService) {}

  ngOnInit(): void {
    this.componenteService.getComponentes().subscribe({
      next: componentes => {
        componentes.forEach(c => {
          this.estilos[c.clave] = c.valor;
        });
      },
      error: err => console.error('Error cargando configuraciones:', err)
    });
  }

  guardarCambios(): void {
    const cambios = Object.entries(this.estilos).filter(([clave, valor]) => clave && clave !== 'undefined');
    cambios.forEach(([clave, valor]) => {
      this.componenteService.updateComponente(clave, valor).subscribe({

        next: () => {
          this.mensaje = 'Cambios guardados correctamente';
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: err => {
          console.error(`Error actualizando ${clave}:`, err);
        }
      });
    });
  }

}
