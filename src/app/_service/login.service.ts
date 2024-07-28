import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtDTO } from '../_dto/jwtDto';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url : string = environment.HOST;
  httpOptions : any;

  constructor(
    private http : HttpClient,
    private sessionService : SessionService
  ) { }

  login(user : string, password : string){

    //sessionStorage.removeItem(environment.TOKEN_NAME);
    this.sessionService.limpiarJwt();

    var data = JSON.stringify({
      "username": user,
      "password": password
    });

    this.httpOptions = {
      body : data,
      headers : new HttpHeaders({
        'Content-type' : 'application/json'
      }),
      responseType : 'json'
    };

    return this.http.request('POST', this.url + "/auth/authenticate", this.httpOptions);
  }

  public refresh(dto: JwtDTO): Observable<JwtDTO> {
    //sessionStorage.removeItem(environment.TOKEN_NAME);
    this.sessionService.limpiarJwt();
    return this.http.post<JwtDTO>(this.url + '/auth/refresh-token', dto);
  }
}
