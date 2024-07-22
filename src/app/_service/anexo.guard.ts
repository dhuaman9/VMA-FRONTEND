import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { SessionService } from './session.service';
import { VmaService } from './vma.service';
import { catchError, map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AnexoGuard implements CanActivate {
  constructor(
    private sessionService: SessionService,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.puedeVerAnexos(route.data['expectedRoles']);
  }

  private puedeVerAnexos = (expectedRoles: string[]): boolean => {
    const userRole = this.sessionService.obtenerRoleJwt();
    expectedRoles = expectedRoles.map(rol => rol.toUpperCase());
    if (!expectedRoles.includes(userRole.toUpperCase())) {
      Swal.fire('Permiso denegado', 'No tiene permisos para ver anexos', 'info');
      this.router.navigate(['/inicio/vma']);
      return false;
    }

    return true;
  }
}
