import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {
  private apiUrl = 'http://127.0.0.1:8000/api/componentes';

  constructor(private http: HttpClient) {}

  getComponentes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateComponente(clave: string, valor: string): Observable<any> {
    return this.http.post(this.apiUrl, { clave, valor });
  }
}
