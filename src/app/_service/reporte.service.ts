import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ListaReporte } from '../pages/reporte/models/reporte';
import {ChartDto} from "../pages/reporte/models/chart-dto";
import {RegistroPromedioTrabajadorVMAChartDto} from "../pages/reporte/models/RegistroPromedioTrabajadorVMAChartDto";
import {PieChartBasicoDto} from "../pages/reporte/models/pie-chart-basico-dto";
import {BarChartBasicoDto} from "../pages/reporte/models/bar-chart-basico-dto";
import { ComparativoUNDDTO } from "../pages/reporte/models/comparativo-und-dto";
import { CostoTotalIncurridoCompletoDTO } from "../pages/reporte/models/costo-total-incurrido-completo";

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

    //grafico 13
    generarReporteUNDSobrepasanParametrosAnexoUno(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-sobrepasan-parametro-anexo1?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 14
    generarReporteUNDFacturadosPagoAdicional(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-facturado-pago-adicional?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 15
    generarReporteUNDPagoAdicionalRealizado(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-pago-adicional?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }
    
    //grafico 16
    generarReportePorcentajesTUNDParametroAnexo2(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-parametro-anexo2?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 17
    generarReporteUNDPlazoAdicionalOtorgado(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-plazo-adicional?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 18
    generarReportePorcentajeUNDSuscritoAcuerdo(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-und-suscritos?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 19
    generarReportePorcentajeReclamosRecibidosVMA(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-reclamos-recibidos-vma?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 20
    generarReporteReclamosFundadosVMA(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/porcentaje-reclamos-fundados-vma?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 21 y 22
    generarReporteCostoTotalIncurrido(anio: number): Observable<CostoTotalIncurridoCompletoDTO> {
      return this.http.get(`${this.url}/api/reporte/costo-total-incurrido?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.item));
    }

    //grafico 23
    generarReporteCostoTotalAnualIncurrido(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/costo-total-incurrido-por-ep?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }


    //grafico 24 y 25
    generarReporteCostoAnualMuestrasInopinadas(anio: number): Observable<CostoTotalIncurridoCompletoDTO> {
      return this.http.get(`${this.url}/api/reporte/costo-anual-incurrido-muestras-inopinadas?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.item));
    }

    //grafico 26
    generarGraficoCostoAnualIncurridoInopinadas(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/costo-anual-incurrido-muestras-inopinadas-completo?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }

    //grafico 27
  
    generarReporteCostoTotalIncurridoOtros(anio: number): Observable<BarChartBasicoDto[]> {
      return this.http.get(`${this.url}/api/reporte/costo-total-incurrido-otros?anio=${anio.toString()}`)
        .pipe(map((response: any) => response.items));
    }
    
    
    //grafico 13
   /* generarReporteDiagramaFlujoYBalancePresentados(anio: number): Observable<BarChartBasicoDto[]> {
        return this.http.get(`${this.url}/api/reporte/diagrama-flujo-balance-presentado?anio=${anio.toString()}`)
          .pipe(map((response: any) => response.items));
    }*/

//grafico 27
  

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