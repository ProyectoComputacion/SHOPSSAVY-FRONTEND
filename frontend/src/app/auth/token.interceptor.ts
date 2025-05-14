import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = sessionStorage.getItem('userToken');
  const apiUrl = req.url.startsWith('http') ? req.url : `http://127.0.0.1:8000${req.url}`;

  const authReq = token
    ? req.clone({
        url: apiUrl,
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req.clone({ url: apiUrl });

  return next.handle(authReq);
}

}
