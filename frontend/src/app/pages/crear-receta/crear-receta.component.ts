import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-crear-receta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-receta.component.html',
  styleUrls: ['./crear-receta.component.css']
})
export class CrearRecetaComponent implements OnInit {
  nombreReceta: string = '';
  tipoReceta: string = 'Normal';
  categoriaReceta: string = '';
  imagenReceta: string = '';
  categorias: string[] = ["pasta", "ensaladas", "sandwiches", "tacos", "pizza", "mexicana",
                          "sopas", "arroz", "hamburguesas", "pescados", "postres", "carnes",
                          "tapas", "legumbres", "entrantes", "cocina asiatica", "bebidas", "mariscos"];

  searchQuery: string = '';
  productos: any[] = [];
  ingredientesSeleccionados: { id: number, name: string, quantity: number, unit: string }[] = [];
  mensajeCamposIncompletos: boolean = false;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

buscarProductos(): void {
  if (!this.searchQuery.trim()) {
    alert("Ingresa un nombre de producto para buscar.");
    return;
  }

  this.http.get<any[]>(`/api/productos?search=${this.searchQuery}`).subscribe(
    (data) => {
      this.productos = data.map(p => ({ ...p, anadido: false }));
    },
    (error) => {
      console.error('Error buscando productos:', error);
    }
  );
}


agregarIngrediente(producto: any): void {
  if (!this.ingredientesSeleccionados.some(i => i.id === producto.id)) {
    this.ingredientesSeleccionados.push({
      id: producto.id,
      name: producto.name,
      quantity: 1,
      unit: "unidad"
    });
  }

  // Marcar visualmente que fue añadido
  producto.anadido = true;
}


eliminarIngrediente(id: number): void {
  // Quitar el ingrediente de la lista de seleccionados
  this.ingredientesSeleccionados = this.ingredientesSeleccionados.filter(i => i.id !== id);

  // Buscarlo en la lista de productos y desmarcarlo
  const producto = this.productos.find(p => p.id === id);
  if (producto) {
    producto.anadido = false;
  }
}


guardarReceta(): void {
  if (!this.nombreReceta || this.ingredientesSeleccionados.length === 0 || !this.categoriaReceta) {
    this.mensajeCamposIncompletos = true;
    return;
  }

  this.mensajeCamposIncompletos = false;

  const nuevaReceta = {
    name: this.nombreReceta,
    category: this.categoriaReceta,
    tipo: this.tipoReceta,
    imagen: this.imagenReceta,
    ingredientes: this.ingredientesSeleccionados.map(i => ({
      id: i.id,
      quantity: i.quantity.toString(),
      unit: i.unit || "unidad"
    }))
  };

  this.http.post('/api/recipes', nuevaReceta).subscribe(
    () => {
      const modalEl = document.getElementById('modalRecetaCreada');
      if (modalEl) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();

        // ❗ Esperar 3 segundos antes de ocultar el modal y evitar conflictos con el foco
        setTimeout(() => {
          // Remover el foco del botón activo (por accesibilidad)
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }

          modalInstance.hide();
        }, 3000);
      }

      this.limpiarFormulario();
    },
    (error) => {
      console.error('Error guardando receta:', error);
    }
  );
}

  limpiarFormulario(): void {
    this.nombreReceta = '';
    this.tipoReceta = 'Recetas';
    this.categoriaReceta = '';
    this.imagenReceta = '';
    this.ingredientesSeleccionados = [];
    this.searchQuery = '';
    this.productos = [];
  }
}
