import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RolesExpectedGuard implements CanActivate {

  constructor(private sessionService: SessionService) {}

   canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = route.data['expectedRoles'];

    return this.puedeVisualizar(expectedRole)
  }

  private puedeVisualizar = (expectedRoles: string[]): boolean => {
    const userRole = this.sessionService.obtenerRoleJwt();
    const expectedRolesUpper = expectedRoles.map(role => role.toUpperCase());
    if (!expectedRolesUpper.includes(userRole)) {
      Swal.fire({
        title: 'Permiso denegado',
        text: 'Usted no tiene permisos para acceder a este recurso',
        icon: 'info',
        confirmButtonText: 'Aceptar'
      });
      return false;
    }

    return true;
  }
}
