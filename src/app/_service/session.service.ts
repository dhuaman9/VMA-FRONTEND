import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private router: Router) {}

  // Guardar el token en localStorage
  cargarJwt(token: string) {
    localStorage.setItem(environment.TOKEN_NAME, token);
  }

  // Retornar el token desde localStorage
  retornarJwt() {
    return localStorage.getItem(environment.TOKEN_NAME);
  }

  // Eliminar el token de localStorage
  limpiarJwt() {
    localStorage.removeItem(environment.TOKEN_NAME);
  }

  obtenerSubjectJwt() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.retornarJwt());
    return decodedToken.sub;
  }

  obtenerShortNameJwt() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.retornarJwt());
    return decodedToken.shortname;
  }

  obtenerRoleJwt() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.retornarJwt());
    return decodedToken.role;
  }

  estaLogeado() {
    //let token = sessionStorage.getItem(environment.TOKEN_NAME);
    let token = this.retornarJwt();
    return token != null;
  }

  obtenerUserNameJwt() {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.retornarJwt());
    return decodedToken.username;
  }

  getTipoUsuario(): string {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(this.retornarJwt());
    return decodedToken.typeUser;
  }

  cerrarSession() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
