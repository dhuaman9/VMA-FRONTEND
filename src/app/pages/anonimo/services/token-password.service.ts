import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {TokenPassword} from "../models/token-password";
import {RecuperarPassword} from "../models/recuperar-password";

@Injectable({
  providedIn: 'root'
})
export class TokenPasswordService {
  url : string = environment.HOST;

  constructor(private http: HttpClient) { }

  getTokenPassword(token: string): Observable<TokenPassword>{
    return this.http.get<TokenPassword>(`${environment.HOST}/tokens/${token}`);
  }

  recuperarPassword(token: string, dto: RecuperarPassword): Observable<void> {
    return this.http.post<void>(`${this.url}/tokens/recuperar-password/${token}`, dto);
  }
}
