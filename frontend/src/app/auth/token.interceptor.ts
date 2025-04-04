import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("TokenInterceptor: Interceptando solicitud:", req);
    const token = sessionStorage.getItem('userToken');

    if (token) {
      console.log("TokenInterceptor: Token encontrado, añadiendo cabecera Authorization:", token);
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log("TokenInterceptor: Nueva solicitud con token:", authReq);
      return next.handle(authReq);
    }

    console.log("TokenInterceptor: No se encontró token, enviando solicitud sin modificaciones.");
    return next.handle(req);
  }
}
