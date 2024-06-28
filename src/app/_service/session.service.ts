import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private router : Router) { }

  cargarJwt(token : string){
    sessionStorage.setItem(environment.TOKEN_NAME, token);
  }

  retornarJwt(){
    return sessionStorage.getItem(environment.TOKEN_NAME);
  }

  limpiarJwt(){
    sessionStorage.removeItem(environment.TOKEN_NAME);
    //sessionStorage.clear();
  }

  obtenerSubjectJwt(){
    const helper = new JwtHelperService();
    const decodedToken =  helper.decodeToken(this.retornarJwt());
    return decodedToken.sub;
  }

  obtenerShortNameJwt(){
    const helper = new JwtHelperService();
    const decodedToken =  helper.decodeToken(this.retornarJwt());
    return decodedToken.shortname;
  }

  obtenerRoleJwt(){
    const helper = new JwtHelperService();
    const decodedToken =  helper.decodeToken(this.retornarJwt());
    return decodedToken.role;
  }

  estaLogeado(){
    //let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let token = this.retornarJwt();
    return token!=null;
  }

  cerrarSession(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
}
