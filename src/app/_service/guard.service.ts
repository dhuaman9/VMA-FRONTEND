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

    /*if(!rpta){
      this.sessionService.cerrarSession();
      return false;
    } else {
      
      //verificar si el token no ha expirado
      const helper = new JwtHelperService();
      
      //let token = sessionStorage.getItem(environment.TOKEN_NAME);
      let token = this.sessionService.retornarJwt();
      
      if(!helper.isTokenExpired(token)){

         //verificar si tienes el rol necesario para acceder a la pagina
        //this.usuarioService.findModules().subscribe(response=>{
          //console.log(response);
        //})/

        if(route.data.expectedRol){
          const expectedRol  = route.data.expectedRol;
          const decodedToken = helper.decodeToken(token);
          let realRole       = decodedToken.role;
          if(expectedRol.indexOf(realRole)===-1){
            this.sessionService.cerrarSession();
            return false;
          }
        }
        
        return true;
      
      } else{
        this.sessionService.cerrarSession();
        return false;
      }
    }*/
  }
}
