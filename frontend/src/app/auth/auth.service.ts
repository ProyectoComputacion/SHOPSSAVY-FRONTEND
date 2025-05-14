import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.http.post(`${this.apiURL}/login`, { username, password }, { headers }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          sessionStorage.setItem('userToken', response.access_token);
          sessionStorage.setItem('user', JSON.stringify(response.user)); // Guarda el user completo
        }
      }),
      catchError(error => {
        let errorMessage = 'Error en el login, verifica tus credenciales';
        if (error.status === 401) {
          errorMessage = 'Credenciales incorrectas. Inténtalo de nuevo.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

register(username: string, password: string, role: string, adminKey?: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  });

  const payload: any = { username, password, role };
  if (role === 'admin' && adminKey) {
    payload.admin_key = adminKey;
  }

  return this.http.post(`${this.apiURL}/register`, payload, { headers }).pipe(
    tap((response: any) => {
      if (response.access_token) {
        sessionStorage.setItem('userToken', response.access_token);
        sessionStorage.setItem('user', JSON.stringify(response.user));
      }
    }),
    catchError(error => {
      return throwError(() => new Error('Error en el registro, verifica los datos'));
    })
  );
}


  logout(): void {
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem('userToken');
    return !!token;
  }

  getUser(): any {
    return JSON.parse(sessionStorage.getItem('user') || 'null');
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  header() {
    const token = sessionStorage.getItem('userToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
}
