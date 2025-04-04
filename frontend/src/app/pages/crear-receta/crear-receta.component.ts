import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  buscarProductos(): void {
    if (!this.searchQuery.trim()) {
      alert("Ingresa un nombre de producto para buscar.");
      return;
    }

    this.http.get<any[]>(`/api/productos?search=${this.searchQuery}`).subscribe(
      (data) => { this.productos = data; },
      (error) => { console.error('Error buscando productos:', error); }
    );
  }

  agregarIngrediente(producto: any): void {
    if (!this.ingredientesSeleccionados.some(i => i.id === producto.id)) {
      this.ingredientesSeleccionados.push({ id: producto.id, name: producto.name, quantity: 1, unit: "unidad" });
    }
  }

  eliminarIngrediente(id: number): void {
    this.ingredientesSeleccionados = this.ingredientesSeleccionados.filter(i => i.id !== id);
  }

  guardarReceta(): void {
    if (!this.nombreReceta || this.ingredientesSeleccionados.length === 0 || !this.categoriaReceta) {
      alert("Completa todos los campos.");
      return;
    }

    const nuevaReceta = {
      name: this.nombreReceta,
      category: this.categoriaReceta,
      tipo: this.tipoReceta,
      imagen: this.imagenReceta,
      ingredientes: this.ingredientesSeleccionados.map(i => ({
        id: i.id,
        quantity: i.quantity.toString(),  // Convertir a string para evitar errores
        unit: i.unit || "unidad" // Unidad por defecto si no se especifica
      }))
    };

    this.http.post('/api/recipes', nuevaReceta).subscribe(
      () => { alert("Receta guardada correctamente."); },
      (error) => { console.error('Error guardando receta:', error); }
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
