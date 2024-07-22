import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AnexoService {
  url: string = `${environment.HOST}/anexos`;
  constructor(private http: HttpClient) { }

  getListAnexoRegistrosVMA(anio: number): Observable<any> {
    return this.http.get(`${this.url}/registros-vma?anio=${anio}`);
  }
}
