import { Injectable } from "@angular/core";
import { RegistroVMA } from "src/app/pages/vma/models/registroVMA";
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { RegistroVmaRequest } from "src/app/pages/vma/models/registroVMARequest";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DatePipe } from '@angular/common';

  @Injectable({
        providedIn: 'root'
  })

  export class RegistroVMAService {
    url: string = `${environment.HOST}`;
    token: string = sessionStorage.getItem(environment.TOKEN_NAME);
    httpOptions : any;

    constructor( private http: HttpClient, private datePipe: DatePipe) {

    }

    findById(id: number){

      this.httpOptions = {
        headers : new HttpHeaders({
          'Content-type' : 'application/json'
        }),
        responseType : 'json'
      };
      return this.http.get<RegistroVMA>(this.url+'/registroVMA/findByid/'+id, {
        headers : new HttpHeaders({'Content-Type':'application/json'}),
        responseType : 'json'
      });
    }

    findAll(){
      return this.http.get<RegistroVMA[]>(this.url+'/registroVMA/listar', {
        headers : new HttpHeaders({'Content-Type':'application/json'}),
        responseType : 'json'
      });
    }

    saveRegistroVMA(request: RegistroVmaRequest): Observable<void> {
      return this.http.post<void>(`${this.url}/registroVMA`, request);
    }

  
    searchRegistroVmas(page:number, size: number, search: string, empresaId?: number, estado?: string, fechaInicio?: Date, fechaFin?: Date, year?: number): Observable<any> {
      const params = this.buildParams(page, size, search, empresaId, estado, fechaInicio, fechaFin, year);
      return this.http.get(`${this.url}/registroVMA/search`, { params });
    }

    descargarReporteRegistrosVMAExcel(ids: number[], filtrosSeleccionados: any, textoBusqueda: string): void {
      let params = new HttpParams();
    
      // Si hay registros seleccionados, agrega sus IDs a los parámetros
      if (ids && ids.length > 0) {
        ids.forEach(id => {
          params = params.append('idsVma', id.toString());
        });
      } else {
        // Si no hay registros seleccionados, agregar el parámetro para "todos los registros"
        params = params.append('todos', 'true');
      }
    
      // Agregar los filtros seleccionados a los parámetros
      if (filtrosSeleccionados.eps) {
        params = params.append('eps', filtrosSeleccionados.eps);
      }
      if (filtrosSeleccionados.estado) {
        params = params.append('estado', filtrosSeleccionados.estado);
      }
      if (filtrosSeleccionados.anio) {
        params = params.append('anio', filtrosSeleccionados.anio.toString());
      }
       // Formatear fechas antes de enviarlas
      if (filtrosSeleccionados.fechaDesde) {
        const fechaDesdeFormateada = this.datePipe.transform(filtrosSeleccionados.fechaDesde, 'dd-MM-yyyy');
        params = params.append('fechaDesde', fechaDesdeFormateada!);
      }

      if (filtrosSeleccionados.fechaHasta) {
        const fechaHastaFormateada = this.datePipe.transform(filtrosSeleccionados.fechaHasta, 'dd-MM-yyyy');
        params = params.append('fechaHasta', fechaHastaFormateada!);
      }

      // Agregar el texto de búsqueda global si está presente
      if (textoBusqueda) {
        params = params.append('busquedaGlobal', textoBusqueda);
      }
    
      // Realizar la solicitud al backend
      this.http.get(`${this.url}/registroVMA/reporte-registros-vma`, { params, responseType: 'blob' }).subscribe((data: Blob) => {
        const blob = data;
        const a = document.createElement('a');
        a.download = 'registros_vma.xlsx';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      });
    }

   /* descargarReporteRegistrosVMAExcel(ids?: number[]): void{

      let params = new HttpParams();
      //ids.forEach(id => {
       // params = params.append('idsVma', id.toString());
      //});

      if (ids && ids.length > 0) {
        ids.forEach(id => {
          params = params.append('idsVma', id.toString());
        });
      } else {
        // parámetro específico  "todos los registros"
         params = params.append('todos', 'true');
      }

      this.http.get(`${this.url}/registroVMA/reporte-registros-vma`, { params, responseType: 'blob' }).subscribe((data: Blob) => {
        const blob = data;
        const a = document.createElement('a');
        a.download = 'registros_vma.xlsx';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      });

    }*/

    descargarReporteEPSsinRegistroVMA(ids?: number[]): void{
      //descargarExcel(ids: number[]): void{
        let params = new HttpParams();
        
  
        if (ids && ids.length > 0) {
          ids.forEach(id => {
            params = params.append('idsVma', id.toString());
          });
        } else {
          // parámetro específico  "todos los registros"
           params = params.append('todos', 'true');
        }
      
        this.http.get(`${this.url}/registroVMA/reporte-eps-no-registraron-vma`, { params, responseType: 'blob' }).subscribe((data: Blob) => {
          const blob = data;
          const a = document.createElement('a');
          a.download = 'eps_no_registraron_vma.xlsx';
          a.href = URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(a.href);
        });
      }

    private buildParams(page:number, size: number, search: string, empresaId?: number, estado?: string, fechaInicio?: Date, fechaFin?: Date, year?: number): HttpParams {
      let params = new HttpParams();
      if (empresaId) params = params.set('empresaId', empresaId.toString());
      if (estado) params = params.set('estado', estado);
      if (fechaInicio) params = params.set('startDate', this.formatearFecha(fechaInicio));
      if (fechaFin) params = params.set('endDate', this.formatearFecha(fechaFin));
      if (year) params = params.set('year', year.toString());
      if (search) params = params.set('search', search);
      params = params.set('size', size.toString());
      params = params.set('page', page.toString());
      return params;
    }

    private formatearFecha(date: Date): string {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

   

    obtenerRegistroVMASinCompletar(): Observable<RegistroVMA | null> {
      return this.http.get<RegistroVMA>(this.url+'/registroVMA/alerta-para-eps-sin-registrar', { observe: 'response' }).pipe(
        map(response => {
          if (response.status === 204) {
            console.log('No hay Registro VMA pendiente por completar');
            return null;
          }
          return response.body;
        }),
        catchError((error) => {
          console.error('Error en la solicitud', error);
          return of(null); // Retorna null en caso de error para evitar romper la aplicación
        })
      );
  }

}