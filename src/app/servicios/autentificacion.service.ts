import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AutentificacionService {

  constructor(private _http: HttpClient, private _cookieService: CookieService) { }

  login(email: string, contrasenia: string) {
    const body = { email, contrasenia };
    return this._http.post('http://127.0.0.1:8001/api/usuarios/login', body)
      .pipe(
        tap((resp: any) => {
          console.log('Respuesta del servidor:', resp);
          let tokenPayload = JSON.parse(atob(resp['token'].split('.')[1]));
          let email = tokenPayload.username;
          let rol = tokenPayload.roles[0];
          let id = resp.id;
          this.setCookies(email, rol, resp, id);
          let validUser = true;
          return validUser;
        }),
        catchError(error => {
          let validUser = false;
          console.error('Error en la autenticación:', error);
          return throwError(error) || validUser;
        })
    );
  }

  setCookies(email:string, rol:string, resp:any, id:string) {
    this._cookieService.set('token', resp);
    this._cookieService.set('email', email);
    this._cookieService.set('rol', rol);
    this._cookieService.set('id', id); 

  }

  logout(): void {
    this._cookieService.delete('token');
    this._cookieService.delete('email');
    this._cookieService.delete('rol');
    this._cookieService.delete('id');
  }

  getToken(): string {
    return this._cookieService.get('token');
  }

  getRol(): string {
    return this._cookieService.get('rol');
  }

  getEmail(): string {
    return this._cookieService.get('email');
  }

  getId(): string {
    return this._cookieService.get('id');
  }

  isLogged(): boolean {
    return this._cookieService.check('token');
  }


}
