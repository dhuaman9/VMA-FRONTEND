import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AnexoRegistro} from "../_model/anexo-registro";
import {AnexoRespondieronSi} from "../_model/anexo-respondieron-si";
import { AnexoUNDRegistrados } from '../_model/anexo-eps-inspeccionados';
import { AnexoTomaMuestrasInopinadas } from '../_model/anexo-muestras-inopinadas';
import { AnexoEvaluacionVmaAnexo1 } from '../_model/anexo-ep-evaluacion-vma-anexo1';
import { AnexoEvaluacionVmaAnexo2 } from '../_model/anexo-ep-evaluacion-vma-anexo2';
import { AnexoEPAtenciondeReclamosVMA } from '../_model/anexo-ep-reclamos-vma-dto';

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

  getListAnexoUNDregistrados(anio: number): Observable<AnexoUNDRegistrados[]> {
    return this.http.get(`${this.url}/registros-und?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }
  
  //anexo 4
  getListAnexoTomaMuestrasInopinadas(anio: number): Observable<AnexoTomaMuestrasInopinadas[]> {
    return this.http.get(`${this.url}/registros-tomas-muestras-inopinadas?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }
  

  getListAnexoEPRealizaronEvaluacionVMAAnexo1(anio: number): Observable<AnexoEvaluacionVmaAnexo1[]> {
    return this.http.get(`${this.url}/registros-ep-evaluaron-vma-anexo1?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  getListAnexoEPRealizaronEvaluacionVMAAnexo2(anio: number): Observable<AnexoEvaluacionVmaAnexo2[]> {
    return this.http.get(`${this.url}/registros-ep-evaluaron-vma-anexo2?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  getListAnexoAtenciondeReclamosVMA(anio: number): Observable<AnexoEPAtenciondeReclamosVMA[]> {
    return this.http.get(`${this.url}/registros-ep-reclamos-vma?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  /*getListAnexoDetalleCostosUND(anio: number): Observable<AnexoEvaluacionVmaAnexo2[]> {
    return this.http.get(`${this.url}/registros-costos-und?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }*/



/*
  getListAnexoEPRealizaronEvaluacionVMAAnexo1(anio: number): Observable<AnexoEvaluacionVmaAnexo1[]> {
    return this.http.get(`${this.url}/registros-ep-evaluaron-vma-anexo1?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }*/





}
