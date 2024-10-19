import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { SessionService } from 'src/app/_service/session.service';

import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class FichaRegistroGuard implements CanActivate {

    constructor(
        private sessionService: SessionService,
        private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.puedeVerPeriodosVMA(route.data['expectedRoles']);
      }

      private puedeVerPeriodosVMA = (expectedRoles: string[]): boolean => {
        const userRole = this.sessionService.obtenerRoleJwt();
        expectedRoles = expectedRoles.map(rol => rol.toUpperCase());
        if (!expectedRoles.includes(userRole.toUpperCase())) {
            Swal.fire({
                title: 'Permiso denegado',
                text: 'Usted no tiene permisos para Aperturar fechas de registro VMA.',
                icon: 'info',
                confirmButtonText: 'Aceptar'
              });
          return false;
        }
    
        return true;
      }
    


}