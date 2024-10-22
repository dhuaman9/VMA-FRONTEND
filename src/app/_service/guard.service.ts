import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../environments/environment';
import { UserService } from '../pages/usuarios/services/user.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate{

  constructor(
    private sessionService : SessionService,
    private usuarioService : UserService
  ) { }

  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){

    //verificar si esta logeado
    let rpta = this.sessionService.estaLogeado();
    return rpta;
  }
}
