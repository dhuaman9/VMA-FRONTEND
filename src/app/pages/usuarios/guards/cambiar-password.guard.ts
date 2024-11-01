import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionService} from "../../../_service/session.service";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CambiarPasswordGuard implements CanActivate {

  constructor(private sessionService: SessionService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const tipoUsuario = this.sessionService.getTipoUsuario();

    if(tipoUsuario.includes('EPS')) {
      return true;
    }

    Swal.fire('No tiene acceso a esa página', '','info');

    return false;
  }

}