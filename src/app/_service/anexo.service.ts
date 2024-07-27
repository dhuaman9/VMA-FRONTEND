import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AnexoRegistro} from "../_model/anexo-registro";
import {AnexoRespondieronSi} from "../_model/anexo-respondieron-si";

@Injectable({
  providedIn: 'root'
})
export class AnexoService {
  url: string = `${environment.HOST}/anexos`;
  constructor(private http: HttpClient) { }

  getListAnexoRegistrosVMA(anio: number): Observable<AnexoRegistro[]> {
    return this.http.get(`${this.url}/registros-vma?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  getListAnexoMarcaronSi(anio: number): Observable<AnexoRespondieronSi[]> {
    return this.http.get(`${this.url}/respuestas-si?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }
}
