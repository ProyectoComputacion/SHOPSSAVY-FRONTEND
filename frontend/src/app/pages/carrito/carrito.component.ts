import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  cartComparison: any[] = [];
  userId: number | null = null;
  errorMessage = '';
  loading = true;  // Estado de carga general
  loadingDelete: { [key: number]: boolean } = {}; // Estado de carga para eliminar una receta
  loadingClear = false; // Estado de carga para vaciar el carrito

  constructor(private cartService: CartService) {}

  ngOnInit() {
    const storedUserId = sessionStorage.getItem('user_id'); // Obtiene el userId de sessionStorage
    this.userId = storedUserId ? Number(storedUserId) : null;
    console.log(this.userId, 'EL ID DE USUARIO');

    if (this.userId !== null) {
      this.loadCartDetails();
    }
  }

  // ✅ Cargar comparación de precios con animación de carga
  loadCartDetails() {
    this.loading = true; // Iniciar carga
    if (this.userId !== null) {
      this.cartService.getCart(this.userId).subscribe(
        (data) => {
          this.cartComparison = data;
          console.log(this.cartService, 'Carrito?');
          this.loading = false; // Finalizar carga
        },
        (error) => {
          console.error('❌ Error cargando el carrito:', error);
          this.errorMessage = 'Error al cargar el carrito.';
          this.loading = false;
        }
      );
    }
  }

  // ✅ Remover un ítem del carrito con animación de carga
  removeItem(cartItemId: number) {
    this.loadingDelete[cartItemId] = true; // Activar spinner en el botón
    if (this.userId !== null) {
      this.cartService.removeFromCart(cartItemId).subscribe(() => {
        this.cartComparison = this.cartComparison.filter(item => item.id !== cartItemId);
        delete this.loadingDelete[cartItemId]; // Desactivar spinner
      }, error => {
        console.error('❌ Error eliminando ítem del carrito:', error);
        delete this.loadingDelete[cartItemId];
      });
    }
  }

  // ✅ Vaciar el carrito con animación de carga
  clearCart() {
    this.loadingClear = true; // Activar spinner
    if (this.userId !== null) {
      this.cartService.clearCart(this.userId).subscribe(() => {
        this.cartComparison = [];
        this.loadingClear = false; // Desactivar spinner
      }, error => {
        console.error('❌ Error al vaciar el carrito:', error);
        this.loadingClear = false;
      });
    }
  }
}
