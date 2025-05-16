import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ComponenteService {
  private apiUrl = 'http://127.0.0.1:8000/api/componentes';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getComponentes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.auth.header());
  }

  // ✅ Aquí se indica correctamente que clave es de tipo string
  updateComponente(clave: string, valor: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clave}`, { valor }, this.auth.header());
  }
}
