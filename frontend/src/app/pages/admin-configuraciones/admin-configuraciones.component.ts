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
    const cambios = Object.entries(this.estilos);
    let cambiosPendientes = cambios.length;

    cambios.forEach(([clave, valor]) => {
      this.componenteService.updateComponente(clave, valor).subscribe({
        next: () => {
          cambiosPendientes--;

          // Solo recargar cuando todos los cambios estén guardados
          if (cambiosPendientes === 0) {
            this.mensaje = 'Cambios guardados correctamente, aplicando cambios...';
            setTimeout(() => {
              location.reload(); // 🔁 Recarga la web completamente (como F5)
            }, 10); // Espera 1s para que el mensaje se vea
          }
        },
        error: err => {
          console.error(`Error actualizando ${clave}:`, err);
        }
      });
    });
  }


}
