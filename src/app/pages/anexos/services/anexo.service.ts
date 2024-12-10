import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnexoRegistro } from 'src/app/pages/anexos/models/anexo-registro';
import { AnexoRespondieronSi } from 'src/app/pages/anexos/models/anexo-respondieron-si';
import { AnexoUNDRegistrados } from 'src/app/pages/anexos/models/anexo-eps-inspeccionados';
import { AnexoTomaMuestrasInopinadas } from 'src/app/pages/anexos/models/anexo-muestras-inopinadas';
import { AnexoEvaluacionVmaAnexo1 } from 'src/app/pages/anexos/models/anexo-ep-evaluacion-vma-anexo1';
import { AnexoEvaluacionVmaAnexo2 } from 'src/app/pages/anexos/models/anexo-ep-evaluacion-vma-anexo2';
import { AnexoEPAtenciondeReclamosVMA } from 'src/app/pages/anexos/models/anexo-ep-reclamos-vma';
import { AnexoCostosUND } from 'src/app/pages/anexos/models/anexo-costos-und';
import { AnexoCostoTotalMuestrasInopinadas } from 'src/app/pages/anexos/models/anexo-costo-total-muestras-inopinadas';
import { AnexoCostoTotalesIncurridos } from 'src/app/pages/anexos/models/anexo-costo_totales-incurridos';
import { AnexoIngresos } from 'src/app/pages/anexos/models/anexo-ingresos';

@Injectable({
  providedIn: 'root',
})
export class AnexoService {
  url: string = `${environment.HOST}/anexos`;
  constructor(private http: HttpClient) {}

  getListAnexoRegistrosVMA(anio: number): Observable<AnexoRegistro[]> {
    return this.http
      .get(`${this.url}/registros-vma?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  getListAnexoMarcaronSi(anio: number): Observable<AnexoRespondieronSi[]> {
    return this.http
      .get(`${this.url}/respuestas-si?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  getListAnexoUNDregistrados(anio: number): Observable<AnexoUNDRegistrados[]> {
    return this.http
      .get(`${this.url}/registros-und?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  //anexo 4
  getListAnexoTomaMuestrasInopinadas(
    anio: number
  ): Observable<AnexoTomaMuestrasInopinadas[]> {
    return this.http
      .get(`${this.url}/registros-tomas-muestras-inopinadas?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  //anexo 5
  getListAnexoEPRealizaronEvaluacionVMAAnexo1(
    anio: number
  ): Observable<AnexoEvaluacionVmaAnexo1[]> {
    return this.http
      .get(`${this.url}/registros-ep-evaluaron-vma-anexo1?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  //anexo 6
  getListAnexoEPRealizaronEvaluacionVMAAnexo2(
    anio: number
  ): Observable<AnexoEvaluacionVmaAnexo2[]> {
    return this.http
      .get(`${this.url}/registros-ep-evaluaron-vma-anexo2?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  //anexo 7
  getListAnexoAtenciondeReclamosVMA(
    anio: number
  ): Observable<AnexoEPAtenciondeReclamosVMA[]> {
    return this.http
      .get(`${this.url}/registros-ep-reclamos-vma?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  //anexo 8
  getListAnexoCostosUND(anio: number): Observable<AnexoCostosUND[]> {
    return this.http
      .get(`${this.url}/registros-costos-und?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  //anexo 9
  getListAnexoCostosTotalesxMuestrasInopinadas(
    anio: number
  ): Observable<AnexoCostoTotalMuestrasInopinadas[]> {
    return this.http
      .get(
        `${this.url}/registros-costos-totales-muestras-inopinadas?anio=${anio}`
      )
      .pipe(map((response: any) => response.items));
  }

  //anexo 10
  getListAnexoDetalleCostosTotalesIncurridos(
    anio: number
  ): Observable<AnexoCostoTotalesIncurridos[]> {
    return this.http
      .get(`${this.url}/registros-costos-totales-incurridos?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  getListAnexoIngresosVMA(anio: number): Observable<AnexoIngresos[]> {
    return this.http
      .get(`${this.url}/registros-ingresos-vma?anio=${anio}`)
      .pipe(map((response: any) => response.items));
  }

  
  
}
