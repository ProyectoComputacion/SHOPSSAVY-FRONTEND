import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.scss']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: string[] = ['user', 'chef', 'admin'];
  mensaje: string = '';

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.http.get<any[]>('/api/users', this.auth.header()).subscribe({
      next: res => {
        this.usuarios = res.map(u => ({ ...u, nuevoRol: u.role }));
      },
      error: err => console.error('Error al obtener usuarios:', err)
    });
  }

  cambiarRol(usuario: any) {
    const payload = { role: usuario.nuevoRol };
    this.http.put(`/api/admin/users/${usuario.id}/role`, payload, this.auth.header()).subscribe({
      next: () => {
        this.mensaje = 'Rol actualizado correctamente';
        usuario.role = usuario.nuevoRol;
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error('Error actualizando rol:', err)
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    this.http.delete(`/api/admin/users/${id}`, this.auth.header()).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado correctamente';
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: err => console.error('Error al eliminar usuario:', err)
    });
  }
}
