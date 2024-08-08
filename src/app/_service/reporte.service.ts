import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ReporteParamCalidadDto } from "../_dto/reporteParamCalidadDto";
import { ReporteParamCalidadExportDto } from "../_dto/reporteParamCalidadExportDto";
import { ReporteVarGestionDto } from "../_dto/reporteVarGestionDto";
import { ReporteVarOperacionalDto } from "../_dto/reporteVarOperacionalDto";
import { ListaReporte } from '../_model/reporte';
import {ChartDto} from "../_model/chart-dto";
import {RegistroPromedioTrabajadorVMAChartDto} from "../_model/RegistroPromedioTrabajadorVMAChartDto";
import {PieChartBasicoDto} from "../_model/pie-chart-basico-dto";
import {BarChartBasicoDto} from "../_model/bar-chart-basico-dto";
import { ComparativoUNDDTO } from "../_model/comparativo-und-dto";

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

    reporteRegistros(anio: number): Observable<ChartDto[]> {
        return this.http.get(`${this.url}/api/reporte/registros?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }

    reporteRespuestaSiNo(anio: number): Observable<ChartDto[]> {
        return this.http.get(`${this.url}/api/reporte/respuesta-si-no?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }

    generarReporteTrabajadoresDedicadosRegistro(anio: number): Observable<RegistroPromedioTrabajadorVMAChartDto[]> {
      return this.http.get(`${this.url}/api/reporte/trabajadores-dedicados-registro?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }

    generarReporteNumeroTotalUND(anio: number): Observable<PieChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/numero-total-und?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    generarReporteDiagramaUNDInspeccionados(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/numero-und-inspeccionados?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }

    generarReporteDiagramaFlujoYBalance(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/diagrama-flujo-balance?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }
    //grafico 8
    generarReporteDiagramaFlujoYBalancePresentados(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/diagrama-flujo-balance-presentado?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }
    //grafico 9
    generarReporteComparativoUND(anio: number): Observable<ComparativoUNDDTO[]> {
      return this.http.get(`${this.url}/api/reporte/comparativo-UND?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 10
    generarReportePorcentajeUNDConCajaRegistro(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/porcentaje-und-caja-registro?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }

    //grafico 11
    generarReportePorcentajeUNDTomaMuestraInopinada(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/porcentaje-und-muestra-inopinada?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }


    //grafico 12
    generarReporteTotalMuestrasInopinadas(anio: number): Observable<PieChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/porcentaje-total-muestras-inopinadas?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }

    generarReporteUNDSobrepasanParametrosAnexoUno(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-sobrepasan-parametro-anexo1?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    generarReporteUNDFacturadosPagoAdicional(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-facturado-pago-adicional?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    generarReporteUNDPagoAdicionalRealizado(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-pago-adicional?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    
    //grafico 13
   /* generarReporteDiagramaFlujoYBalancePresentados(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/diagrama-flujo-balance-presentado?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }*/


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

    getListaReportes(cat) {
        return this.http
          .get<any>('assets/lista-reportes.json')
          .toPromise()
          .then((res) => <ListaReporte[]>res.data)
          .then((data) => {
            return data.filter((item) => item.category === cat);
        });
    }

}