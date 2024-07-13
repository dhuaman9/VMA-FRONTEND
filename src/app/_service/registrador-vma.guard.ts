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
export class RegistradorVmaGuard implements CanActivate {
  // expectedRol: string;
  
  constructor(
    private sessionService: SessionService, 
    private router: Router,
    private vmaService: VmaService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const expectedRole = route.data['expectedRole'];

    return this.vmaService.isRegistroCompleto().pipe(
      map(isRegistroCreado => this.isAbleToRegister(isRegistroCreado, expectedRole)),
      catchError(this.onError)
    )
  }

  private isAbleToRegister = (isRegistroCreado: boolean, expectedRole: string): boolean => {
    const userRole = this.sessionService.obtenerRoleJwt();
    console.log(expectedRole.toUpperCase(), userRole.toUpperCase())
    if (isRegistroCreado || expectedRole.toUpperCase() !== userRole.toUpperCase()) {
      Swal.fire('Permiso denegado', 'No tiene permisos para registrar  VMA', 'info');
      this.router.navigate(['/inicio/vma']);
      return false;
    }

    return true;
  }
  

  private onError = () => {
      Swal.fire('Ocurrió un error', 'Ocurrió un error al intentar ingresar al registro VMA', 'error');
      this.router.navigate(['/inicio/vma']);
      return of(false);
  }
}
