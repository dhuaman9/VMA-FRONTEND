import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ReporteParamCalidadDto } from "../_dto/reporteParamCalidadDto";
import { ReporteParamCalidadExportDto } from "../_dto/reporteParamCalidadExportDto";
import { ReporteVarGestionDto } from "../_dto/reporteVarGestionDto";
import { ReporteVarOperacionalDto } from "../_dto/reporteVarOperacionalDto";

@Injectable({
    providedIn: 'root'
  })
export class ReporteService {
   
    private url: string = environment.HOST;
    private token: string = sessionStorage.getItem(environment.TOKEN_NAME);
    private httpOptions : any;

    constructor(
        private http : HttpClient
    ) { }

    fechaprocesa(): Observable<any>{

        //'Authorization': 'Bearer '+this.token
        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };

        return this.http
            .get(`${this.url}/manager/fechaProcesa`, this.httpOptions)
    }

    listavariables(): Observable<any>{

//'Authorization': 'Bearer '+this.token
        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };

        return this.http
            .get(`${this.url}/manager/variable/findAll`, this.httpOptions)
            .pipe(
                map((items) =>
                  items['items'].map((item) => {
                    return {
                      name: item.nomVar,
                      code: item.codVar,
                      desc: item.codVar + ' - '+item.nomVar,
                      periodo : item.tipPer
                    };
                  })
                )
            );
    }

    listaparametros(): Observable<any>{

        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };

        return this.http
            .get(`${this.url}/manager/parametro/findAll`, this.httpOptions)
            .pipe(
                map((items) =>
                  items['items'].map((item) => {
                    return {
                      name: item.nomParam,
                      code: item.codParam,
                      desc: item.codParam + ' - '+item.nomParam
                    };
                  })
                )
            );
    }

    variablesgestion(dto : ReporteVarGestionDto): Observable<any>{

        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };

        return this.http
            .post(`${this.url}/manager/reporte/variablesGestion`, dto, this.httpOptions);
    }

    variablesoperacional(dto : ReporteVarOperacionalDto): Observable<any>{

        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };

        return this.http
            .post(`${this.url}/manager/reporte/variablesOperacional`, dto, this.httpOptions);
    }

    parametroscalidad(dto : ReporteParamCalidadDto): Observable<any>{

        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };

        return this.http
            .post(`${this.url}/manager/reporte/parametrosCalidad`, dto, this.httpOptions);
    }

    exportvariablesgestion(dto : ReporteVarGestionDto){
        return this.http.post(`${this.url}/manager/export/variablesGestion`,dto, {
          responseType: 'blob'
        });
    }

    exportvariablesoperacional(dto : ReporteVarOperacionalDto){
        return this.http.post(`${this.url}/manager/export/variablesOperacional`,dto, {
          responseType: 'blob'
        });
    }

    exportparametroscalidad(dto : ReporteParamCalidadExportDto){
        return this.http.post(`${this.url}/manager/export/parametrosCalidad`,dto, {
          responseType: 'blob'
        });
    }
}