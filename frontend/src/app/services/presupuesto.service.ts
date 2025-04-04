import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresupuestoService {
    
  private apiUrl = 'http://127.0.0.1:8000/api/buscarPorPresupuesto';

  constructor(private http: HttpClient) {}

  buscarPorPresupuesto(presupuesto: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { presupuesto });
  }
}
