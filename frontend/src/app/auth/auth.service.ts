import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://127.0.0.1:8000/api'; // Asegúrate de que esta URL es correcta

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    console.log("AuthService: Enviando datos de login:", { username, password });

    return this.http.post(`${this.apiURL}/login`, { username, password }, { headers }).pipe(
      tap((response: any) => {
        console.log("AuthService: Respuesta del backend:", response);
        if (response.access_token) {
          sessionStorage.setItem('userToken', response.access_token);
          sessionStorage.setItem('userRole', response.user.role); 
          console.log("AuthService: Token guardado en sessionStorage:", response.access_token);
          console.log("✅ Rol guardado en sessionStorage:", response.user.role);
        }
      }),
      catchError(error => {
        console.error("AuthService: Error en login:", error);
        let errorMessage = 'Error en el login, verifica tus credenciales';
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(username: string, password: string, role: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    console.log("AuthService: Enviando datos de registro:", { username, password, role });

    return this.http.post(`${this.apiURL}/register`, { username, password, role }, { headers }).pipe(
      tap((response: any) => {
        console.log("AuthService: Respuesta del backend en registro:", response);
        if (response.access_token) {
          sessionStorage.setItem('userToken', response.access_token);
          sessionStorage.setItem('userRole', response.user.role);
          console.log("AuthService: Token guardado en sessionStorage:", response.access_token);
        }
      }),
      catchError(error => {
        console.error("AuthService: Error en registro:", error);
        return throwError(() => new Error('Error en el registro, verifica los datos'));
      })
    );
  }

  logout(): void {
    console.log("AuthService: Cerrando sesión...");
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('role'); 
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('userToken');
    console.log("AuthService: Verificando autenticación, token encontrado:", token);
    return !!token;
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('role'); 
  }
}
