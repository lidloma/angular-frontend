import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate {

  constructor(private _cookieService: CookieService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const rol = this._cookieService.get('rol'); // Obtener el rol de la cookie

    if (!rol) { // Si no hay rol, redirige al inicio
      this.router.navigate(['/inicio']);
      return false;
    }

    if (rol === 'administrador') { // Si el rol es administrador, permite el acceso
      return true;
    } else { // Si no es administrador, deniega el acceso
      this.router.navigate(['/inicio']);
      return false;
    }
  }
}
