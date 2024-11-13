import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReporteService } from 'src/app/pages/reporte/services/reporte.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import {BarChartDataset} from "src/app/pages/reporte/models/bar-chart-dataset";
import {ChartDto} from "src/app/pages/reporte/models/chart-dto";
import {PieChartBasicoDto} from "src/app/pages/reporte/models/pie-chart-basico-dto";
import {BarChartBasicoDto} from "src/app/pages/reporte/models/bar-chart-basico-dto";
import { ComparativoUNDDTO } from 'src/app/pages/reporte/models/comparativo-und-dto';
import { CostoTotalConcurridoDto } from 'src/app/pages/reporte/models/costo-total-concurrido';
import { CostoTotalIncurridoCompletoDTO } from 'src/app/pages/reporte/models/costo-total-incurrido-completo';
import { RegistroPromedioTrabajadorVMAChartDto } from '../models/RegistroPromedioTrabajadorVMAChartDto';
import {tap, switchMap, delay} from 'rxjs/operators';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
//npm install chartjs-plugin-datalabels
Chart.register(ChartDataLabels);
import { of,forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {
  title = 'GFG';
  isLoading = false;
  years: any[];
  selectedYear: number;
  chartDataNumeroEP: number[];
  chartLabelsNumeroEP: string[] = [];

  chartDataRemisionInfo: BarChartDataset[];
  chartLabelsRemisionInfo: string[] = [];

  chartDataSiNo: BarChartDataset[];
  chartLabelsSiNo: string[] = [];

  chartDataNumeroTotalUND: number[];
  chartLabelsNumeroTotalUND: string[] = [];

  chartTrabajadoresDedicadosRegistroData: BarChartDataset[];
  chartTrabajadoresDedicadosRegistroLabels: string[] = [];

  chartUNDInspeccionadosData: BarChartDataset[];
  chartUNDInspeccionadosLabels: string[] = [];

  chartDiagramaFlujoData: BarChartDataset[];
  chartDiagramaFlujoLabels: string[] = [];

   //grafico 8
  chartDiagramaFlujoPresentadosData: BarChartDataset[];
  chartDiagramaFlujoPresentadosLabels: string[] = [];

  // grafico 9

  tablaData: ComparativoUNDDTO[] = [];
  totalRow = {
    empresa: 'TOTAL',
    registrados: 0,
    inspeccionados: 0,
    identificados: 0,
    porcentajeAB: 0,
    porcentajeAC: 0
  };

  //grafico 10  -  Porcentaje de UND que cuentan con caja de registro
  chartPorcentajeUNDConCajaRegistroData: BarChartDataset[];
  chartPorcentajeUNDConCajaRegistroLabels: string[] = [];

  //grafico 11  -  Porcentaje de UND a los que se realizó la toma de muestra inopinada
  chartPorcentajeUNDTomaMuestraInopinadaData: BarChartDataset[];
  chartPorcentajeUNDTomaMuestraInopinadaLabels: string[] = [];

  // Gráfico 12: Porcentaje de total tomas de muestras inopinadas, según tamaño de la EP
  chartDataPorcentajeUNDConCajaRegistro: number[];
  chartLabelsPorcentajeUNDConCajaRegistro: string[] = [];

  // Gráfico 13: Porcentaje de UND que sobrepasan algún(os) parámetro(s) del Anexo N° 1
  chartPorcentajeUNDSobrepasanParametroAnexo1Data: BarChartDataset[];
  chartPorcentajeUNDSobrepasanParametroAnexo1Labels: string[] = [];

  // Gráfico 14: Porcentaje de UND a los que se ha facturado por concepto de Pago adicional por exceso de concentración,
  // según tamaño de la EP
  chartPorcentajeUNDFacturaronPagoAdicionalData: BarChartDataset[];
  chartPorcentajeUNDFacturaronPagoAdicionalLabels: string[] = [];


   // Gráfico 15: PPorcentaje de UND que realizaron el Pago adicional por exceso de concentración, según tamaño de la EP
  chartPorcentajeUNDPagoAdicionalRealizadoData: BarChartDataset[];
  chartPorcentajeUNDPagoAdicionalRealizadoLabels: string[] = [];


  // Gráfico 16:
  chartPorcentajesUNDParametroAnexo2Data: BarChartDataset[];
  chartPorcentajesUNDParametroAnexo2Labels: string[] = [];

  // Gráfico 17:
  chartReporteUNDPlazoAdicionalOtorgadoData: BarChartDataset[];
  chartReporteUNDPlazoAdicionalOtorgadoLabels: string[] = [];

  // Gráfico 18:
  chartReportePorcentajeUNDSuscritoAcuerdoData: BarChartDataset[];
  chartReportePorcentajeUNDSuscritoAcuerdoLabels: string[] = [];

  // Gráfico 19:
  chartReportePorcentajeReclamosRecibidosVMAData: BarChartDataset[];
  chartReportePorcentajeReclamosRecibidosVMALabels: string[] = [];

   // Gráfico 20:
   chartreporteReclamosFundadosVMAData: BarChartDataset[];
   chartreporteReclamosFundadosVMALabels: string[] = [];

   // Gráfico 21 y 22:
   chartCostoTotalConcurridoData: BarChartDataset[];
   chartCostoTotalConcurridoLabels: string[] = [];
   costoTotalConcurridoList: CostoTotalConcurridoDto[];

   // Gráfico 23:
   chartreporteCostoTotalAnualIncurridoData: BarChartDataset[];
   chartreporteCostoTotalAnualIncurridoLabels: string[] = [];

  // Gráfico 24 y 25:
  chartCostoAnualMuestrasInopinadasData: BarChartDataset[];
  chartCostoAnualMuestrasInopinadasLabels: string[] = [];
  CostoAnualMuestrasInopinadasList: CostoTotalConcurridoDto[];

  // Gráfico 26:  //incluye la empresa sedapal
  chartCostoAnualIncurridoMuestrasInopinadasAllData: BarChartDataset[];
  chartCostoAnualIncurridoMuestrasInopinadasAllLabels: string[] = [];

  //grafico 27
  chartCostoTotalConcurridoOtrosData: BarChartDataset[];
  chartCostoTotalConcurridoOtrosLabels: string[] = [];

  //es necesario , agregar nuevo false, si en caso haya nuevos tabs , la cantidad en el array depende del # de gráficos

     openedTabs: boolean[] = [false, false, false, false, false,
       false, false, false,false, false,
       false, false, false, false, false,
      false, false, false, false,  false,
      false,false, false, false, false];
  activeIndex: number[] = [];

  constructor(
    public route : ActivatedRoute,
    private reporteService: ReporteService
  ) {
    this.initializeYears();
  }

  ngOnInit(): void {
    this.setDefaultYear();//cargara el año actual
  }

  private cargarDatosBarChartSiNo = (registrosSiNoChart: ChartDto[]): void => {
    let porcentajes: number[] = [];
    let labels: string[] = [];
    this.chartDataSiNo = [];
    registrosSiNoChart.forEach(item => {
      labels.push(item.tipo)
      const percentage = (item.cantidadRegistradoPorEmpresa / item.cantidadTotalRegistradoPorEmpresa) * 100;
      porcentajes.push(percentage);
    });

    const sumaTotal: number = porcentajes.reduce((acc, curr) => acc + curr, 0);
    const averagePercentage: number = sumaTotal / porcentajes.length;
    labels.push('PROMEDIO');
    porcentajes.push(averagePercentage);
    this.chartLabelsSiNo = labels;
    this.chartDataSiNo.push({
      label: 'Porcentaje de las EPS, con área dedicada al monitoreo y control de los VMA',
      backgroundColor: '#6fd76f',
      data: porcentajes
    });
  }

  private cargarDatos(registrosDatosBarAndPieChart: ChartDto[], isChartNumero1: boolean): void {
    let labels: string[] = [];
    let cantidadRegistradosPorEmpresa: number[] = [];
    let cantidadRegistradosPorEmpresaTotal: number[] = [];

    registrosDatosBarAndPieChart.forEach(item => {
      labels.push(item.tipo)
      cantidadRegistradosPorEmpresa.push(item.cantidadRegistradoPorEmpresa)
      cantidadRegistradosPorEmpresaTotal.push(item.cantidadTotalRegistradoPorEmpresa)
    });

    if(isChartNumero1) {
      this.cargarChartNumero1([...cantidadRegistradosPorEmpresa], [...cantidadRegistradosPorEmpresaTotal], [...labels]);
    } else {
      this.cargarChartNumero2(labels, cantidadRegistradosPorEmpresa);
    }
  }

  private cargarChartNumero1(cantidadRegistradosPorEmpresa: number[], cantidadRegistradosPorEmpresaTotal: number[], labels: string[]): void {
    const sumaTotalPorEmpresa: number = cantidadRegistradosPorEmpresa.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const sumaTotalEmpresas: number = cantidadRegistradosPorEmpresaTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    cantidadRegistradosPorEmpresa.push(sumaTotalPorEmpresa);
    cantidadRegistradosPorEmpresaTotal.push(sumaTotalEmpresas);
    labels.push('Total EP');
    this.chartLabelsRemisionInfo = labels;
    this.chartDataRemisionInfo = [
      {label: 'EP que remitieron información', backgroundColor: '#42A5F5', data: cantidadRegistradosPorEmpresa},
      {label: 'Total EP', backgroundColor: '#FFA726', data: cantidadRegistradosPorEmpresaTotal},
    ];
  }

  private cargarChartNumero2(labels: string[], cantidadRegistradosPorEmpresa: number[]): void {
    this.chartLabelsNumeroEP = labels;
    this.chartDataNumeroEP = [...cantidadRegistradosPorEmpresa];
  }

  private cargarDatosTrabajadoresDedicadosRegistro = (data: RegistroPromedioTrabajadorVMAChartDto[]): void => {
    this.chartTrabajadoresDedicadosRegistroData = [];
    this.chartTrabajadoresDedicadosRegistroLabels = data.map(item => item.tipo);
    const dataPorTipoEmpresa: number[] = data.map(item => item.promedio);
    const cantidadEmpresasPorTipoEmpresa: number[] = data.map(item => item.cantidadEmpresasPorTipo);
    const cantidadTrabajadoresPorTipoEmpresa: number[] = data.map(item => item.cantidadTrabajadoresDecicados);

    if(data.length) {
      const sumaTotalEmpresas: number = cantidadEmpresasPorTipoEmpresa.reduce((acc, curr) => acc + curr, 0);
      const sumaTotalTrabajadores: number = cantidadTrabajadoresPorTipoEmpresa.reduce((acc, curr) => acc + curr, 0);
      const averagePercentage: number = sumaTotalTrabajadores / sumaTotalEmpresas;
      this.chartTrabajadoresDedicadosRegistroLabels.push('PROMEDIO');
      dataPorTipoEmpresa.push(averagePercentage);
    }

    this.chartTrabajadoresDedicadosRegistroData.push({
      label: 'Número promedio de trabajadores a tiempo completo o parcial en los VMA',
      backgroundColor: '#03A9F4',
      data: dataPorTipoEmpresa
    });
  }

  private cargarDatosNumeroTotalUND = (data: PieChartBasicoDto[]): void => {
    this.chartLabelsNumeroTotalUND = data.map(item => item.label);
    this.chartDataNumeroTotalUND = data.map(item => item.cantidad);
  }

  //DHR GRAF6
  private cargarDatosUNDInspeccionados = (data: BarChartBasicoDto[]): void => {
    this.chartUNDInspeccionadosData = [];
    this.chartUNDInspeccionadosLabels = data.map(item => item.label);
    this.chartUNDInspeccionadosData.push({
      label: 'Porcentaje de UND inspeccionados, según tamaño de la EP.',
      backgroundColor: '#6fd76f',
      data: data.map(item => item.value)
    });
  }

  private cargarDatosDiagramaFlujoBalance = (data: BarChartBasicoDto[]): void => {
    this.chartDiagramaFlujoData = [];
    this.chartDiagramaFlujoLabels = data.map(item => item.label);
    this.chartDiagramaFlujoData.push({
      label: 'Porcentaje de usuarios, a los que se les ha solicitado el diagrama de flujo y balance hídrico',
      backgroundColor: '#6fd76f',
      data: data.map(item => item.value)
    });
  }

  //dhr - grafico 8
  private cargatDatosDiagramaFlujoBalancePresentados = (data: BarChartBasicoDto[]): void => {
    this.chartDiagramaFlujoPresentadosData = [];
    this.chartDiagramaFlujoPresentadosLabels = data.map(item => item.label);
    this.chartDiagramaFlujoPresentadosData.push({
      label: 'Porcentaje de UND, que han presentado el diagrama de flujo y balance hídrico. ',
      backgroundColor: '#47cafa',
      data: data.map(item => item.value)
    });
  }

  // grafico 9

  private loadData(anio: number) {
    return this.reporteService.generarReporteComparativoUND(anio)
      .pipe(tap(data => {
        this.tablaData = data;
        this.calculateTotals();
      }));
  }

  //10 UND que cuentan con caja de registro
  private cargarDatosUNDConCajaRegistro = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDConCajaRegistroData = [];
    this.chartPorcentajeUNDConCajaRegistroLabels = data.map(item => item.label);
    this.chartPorcentajeUNDConCajaRegistroData.push({
      label: 'Porcentaje de UND que cuentan con caja de registro o dispositivo en la parte externa de su predio. ',
      backgroundColor: '#16a0f4',
      data: data.map(item => item.value)
    });
  }

   //11  Porcentaje de UND a los que se realizó la toma de muestra inopinada
   private cargarDatosUNDTomaMuestraInopinada = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDTomaMuestraInopinadaData = [];
    this.chartPorcentajeUNDTomaMuestraInopinadaLabels = data.map(item => item.label);
    this.chartPorcentajeUNDTomaMuestraInopinadaData.push({
      label: 'Porcentaje de UND a los que se realizó la toma de muestra inopinada, según tamaño de EPS. ',
      backgroundColor: '#8f67fa',
      data: data.map(item => item.value)
    });
  }

   //12 Porcentaje de toma de muestra inopinada, según tamaño de la EP

  private cargarDatosTotalMuestrasInopinadas = (data: PieChartBasicoDto[]): void => {
    this.chartLabelsPorcentajeUNDConCajaRegistro = data.map(item => item.label);
    this.chartDataPorcentajeUNDConCajaRegistro = data.map(item => item.cantidad);
  }

  //13  Porcentaje de UND que sobrepasan algún(os) parámetro(s) del Anexo N° 1
  private cargarUNDSobrepasanParametrosAnexo1 = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDSobrepasanParametroAnexo1Data = [];
    this.chartPorcentajeUNDSobrepasanParametroAnexo1Labels = data.map(item => item.label);
    this.chartPorcentajeUNDSobrepasanParametroAnexo1Data.push({
      label: 'Porcentaje de UND que sobrepasan algún(os) parámetro(s) del Anexo N° 1 , según tamaño de EPS. ',
      backgroundColor: '#46cb22',
      data: data.map(item => item.value)
    });
  }


  //graf 14   Porcentaje de UND a los que se ha facturado por concepto de Pago adicional por exceso de concentración
  private cargarUNDFacturasPagoAdicional = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDFacturaronPagoAdicionalData = [];
    this.chartPorcentajeUNDFacturaronPagoAdicionalLabels = data.map(item => item.label);
    this.chartPorcentajeUNDFacturaronPagoAdicionalData.push({
      label: 'Porcentaje de UND a los que se ha facturado por concepto de Pago adicional, según tamaño de EPS. ',
      backgroundColor: '#14b0f4',
      data: data.map(item => item.value)
    });
  }

  // grafico 15  Porcentaje de UND que realizaron el Pago adicional por exceso de concentración, según tamaño de la EP
  private cargarUNDPagoAdicionalRealizados = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDPagoAdicionalRealizadoData = [];
    this.chartPorcentajeUNDPagoAdicionalRealizadoLabels = data.map(item => item.label);
    this.chartPorcentajeUNDPagoAdicionalRealizadoData.push({
      label: 'Porcentaje de UND que realizaron el Pago adicional por exceso de concentración, según tamaño de EPS. ',
      backgroundColor: '#46cb22',
      data: data.map(item => item.value)
    });
  }

   // grafico 16 Porcentaje de UND que sobrepasan algún(os) parámetro(s) del Anexo N° 2 del Reglamento de VMA, según tamaño de la EP
   private cargarPorcentajesUNDParametroAnexo2 = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajesUNDParametroAnexo2Data = [];
    this.chartPorcentajesUNDParametroAnexo2Labels = data.map(item => item.label);
    this.chartPorcentajesUNDParametroAnexo2Data.push({
      label: 'Porcentaje de UND que sobrepasan algún(os) parámetro(s) del Anexo N° 2 del Reglamento de VMA, según tamaño de la EP. ',
      backgroundColor: '#46cb22',
      data: data.map(item => item.value)
    });
  }


  // grafico 17  Porcentaje de UND a los que les ha otorgado un plazo adicional (hasta 18 meses) con el fin de implementar las acciones de mejora y acreditar el cumplimiento de los VMA, según tamaño de la EP.
  private cargarPorcentajesUNDPlazoAdicionalOtorgado = (data: BarChartBasicoDto[]): void => {
    this. chartReporteUNDPlazoAdicionalOtorgadoData = [];
    this. chartReporteUNDPlazoAdicionalOtorgadoLabels = data.map(item => item.label);
    this. chartReporteUNDPlazoAdicionalOtorgadoData.push({
      label: 'Porcentaje de UND a los que les ha otorgado un plazo adicional (hasta 18 meses) con el fin de implementar las acciones de mejora y acreditar el cumplimiento de los VMA, según tamaño de la EP. ',
      backgroundColor: '#70d568',
      data: data.map(item => item.value)
    });
  }

  // grafico 18  Porcentaje de UND que han suscrito un acuerdo en el que se establece un plazo otorgado, por única vez, a fin de ejecutar las acciones de mejora y acreditar el cumplimiento de los VMA, según tamaño de la EP
  private cargarPorcentajesUNDSuscritoAcuerdo = (data: BarChartBasicoDto[]): void => {
    this.chartReportePorcentajeUNDSuscritoAcuerdoData = [];
    this.chartReportePorcentajeUNDSuscritoAcuerdoLabels = data.map(item => item.label);
    this.chartReportePorcentajeUNDSuscritoAcuerdoData.push({
      label: 'Porcentaje de UND que han suscrito un acuerdo en el que se establece un plazo otorgado, por única vez, a fin de ejecutar las acciones de mejora y acreditar el cumplimiento de los VMA, según tamaño de la EP. ',
      backgroundColor: '#53a14d',
      data: data.map(item => item.value)
    });
  }

   // grafico 19  Porcentaje de recibidos por VMA, según tamaño de la EP
   private cargarPorcentajeReclamosRecibidosVMA = (data: BarChartBasicoDto[]): void => {
    this.chartReportePorcentajeReclamosRecibidosVMAData = [];
    this.chartReportePorcentajeReclamosRecibidosVMALabels = data.map(item => item.label);
    this.chartReportePorcentajeReclamosRecibidosVMAData.push({
      label: 'Porcentaje de recibidos por VMA, según tamaño de la EP. ',
      backgroundColor: '#2fb2dc',
      data: data.map(item => item.value)
    });
  }

  // grafico 20  Porcentaje de reclamos por VMA resueltos fundados, según tamaño de la EP
  private cargarReporteReclamosFundadosVMA = (data: BarChartBasicoDto[]): void => {
    this.chartreporteReclamosFundadosVMAData = [];
    this.chartreporteReclamosFundadosVMALabels = data.map(item => item.label);
    this.chartreporteReclamosFundadosVMAData.push({
      label: 'Porcentaje de reclamos por VMA resueltos fundados, según tamaño de la EP. ',
      backgroundColor: '#208af4',
      data: data.map(item => item.value)
    });
  }

   // grafico 21 y 22
  private cargarDatosCostoTotalIncurrido = (data: CostoTotalIncurridoCompletoDTO): void => {
    this.costoTotalConcurridoList=[];  //vaciando lista
    this.chartCostoTotalConcurridoData = [];
    this.chartCostoTotalConcurridoLabels = data.barChartData.map(item => item.label);
    this.costoTotalConcurridoList = data.costoAnualIncurridoList;
    this.chartCostoTotalConcurridoData.push({
      label: 'Costo anual incurrido en la identificación, inspección e inscripción de los UND S/',
      backgroundColor: '#3d8aca',
      data: data.barChartData.map(item => item.value)
    });
  }


  // grafico 23  Costo anual por conexión incurrido en la identificación, inspección e inscripción de los UND
  private cargarDatosCostoAnualIncurrido = (data: BarChartBasicoDto[]): void => {

    this.chartreporteCostoTotalAnualIncurridoData = [];
    this.chartreporteCostoTotalAnualIncurridoLabels = data.map(item => item.label);
    this.chartreporteCostoTotalAnualIncurridoData.push({
      label: 'Costo anual por conexión incurrido en la identificación, inspección e inscripción de los UND. ',
      backgroundColor: '#3d8aca',
      data: data.map(item => item.value)
    });
  }

   // grafico 24 y 25 , Costo anual incurrido por realizar las tomas de muestras inopinadas, según tamaño de la EP
   private cargarDatosCostolMuestrasInopinadas = (data: CostoTotalIncurridoCompletoDTO): void => {
    this.costoTotalConcurridoList=[];  //vaciando lista
    this.chartCostoAnualMuestrasInopinadasData = [];
    this.chartCostoAnualMuestrasInopinadasLabels = data.barChartData.map(item => item.label);
    this.costoTotalConcurridoList = data.costoAnualIncurridoList;
    this.chartCostoAnualMuestrasInopinadasData.push({
      label: 'Costo anual incurrido por realizar las tomas de muestras inopinadas, según tamaño de la EP. S/',
      backgroundColor: '#3d8aca',
      data: data.barChartData.map(item => item.value)
    });
  }

  // grafico 26  : Costo anual por conexión incurrido por realizar las tomas de muestras inopinadas
  private cargarCostoAnualIncurridoMuestrasInopinadasAll = (data: BarChartBasicoDto[]): void => {


    this.chartCostoAnualIncurridoMuestrasInopinadasAllData = [];
    this.chartCostoAnualIncurridoMuestrasInopinadasAllLabels = data.map(item => item.label);
    this.chartCostoAnualIncurridoMuestrasInopinadasAllData.push({
      label: 'Costo anual por conexión incurrido por realizar las tomas de muestras inopinadas. ',
      backgroundColor: '#3d8aca',
      data: data.map(item => item.value)
    });
  }


   // grafico 27  Costo anual por otros gastos incurridos en la implementación de los VMA, según tamaño de la EP (miles de soles)
  private cargarDatosCostoTotalIncurridoOtros = (data: BarChartBasicoDto[]): void => {
    this.chartCostoTotalConcurridoOtrosData = [];
    this.chartCostoTotalConcurridoOtrosLabels = data.map(item => item.label);
    this.chartCostoTotalConcurridoOtrosData.push({
      label: 'Costo anual por otros gastos incurridos en la implementación de los VMA, según tamaño de la EP (miles de soles)',
      backgroundColor: '#3d8aca',
      data: data.map(item => item.value)
    });
  }


  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 2022; year--) {
      this.years.push({ label: year.toString(), value: year });
    }
  }

  applyFilter(): void {
    this.cleanDataChart();
    this.reloadOpenedTabs();
  }

  private setDefaultYear() {
    this.selectedYear = new Date().getFullYear();
  }

  filterText: string = '';


  filterTabs(header: string, content: string): boolean {
    if (!this.filterText) {
      return true;
    }

    const searchText = this.filterText.toLowerCase();
    return header.toLowerCase().includes(searchText) || content.toLowerCase().includes(searchText);
  }

  reloadOpenedTabs(): void {
    const tabsSelected = [];
    this.openedTabs.forEach(isOpen => {
      tabsSelected.push({selected: isOpen});
    });

    tabsSelected.forEach((isOpen, index) => {
      if (isOpen) {
        this.getReporte(index, { tabs: tabsSelected }, true);
      }
    })
  }

  calculateTotals() {
    this.totalRow.registrados = this.tablaData.reduce((sum, item) => sum + item.undregistrados, 0);
    this.totalRow.inspeccionados = this.tablaData.reduce((sum, item) => sum + item.undinspeccionados, 0);
    this.totalRow.identificados = this.tablaData.reduce((sum, item) => sum + item.undidentificados, 0);
    this.totalRow.porcentajeAB = this.totalRow.inspeccionados ? Math.round(this.totalRow.registrados / this.totalRow.inspeccionados * 100) : 0;
    this.totalRow.porcentajeAC = this.totalRow.identificados ? Math.round(this.totalRow.registrados / this.totalRow.identificados * 100) : 0;
  }

  cleanDataChart(): void {
    this.chartDataNumeroEP = undefined;
    this.chartLabelsNumeroEP = [];

    this.chartDataRemisionInfo = undefined;
    this.chartLabelsRemisionInfo = [];

    this.chartDataSiNo = undefined;
    this.chartLabelsSiNo = [];

    this.chartDataNumeroTotalUND = undefined;
    this.chartLabelsNumeroTotalUND = [];

    this.chartTrabajadoresDedicadosRegistroData = undefined;
    this.chartTrabajadoresDedicadosRegistroLabels = [];

    this.chartUNDInspeccionadosData = undefined;
    this.chartUNDInspeccionadosLabels = [];

    this.chartDiagramaFlujoData= undefined;
    this.chartDiagramaFlujoLabels = [];

   //grafico 8
    this.chartDiagramaFlujoPresentadosData = undefined;
    this.chartDiagramaFlujoPresentadosLabels= [];

  //grafico 10  -  Porcentaje de UND que cuentan con caja de registro
    this.chartPorcentajeUNDConCajaRegistroData = undefined;
    this.chartPorcentajeUNDConCajaRegistroLabels = [];

  //grafico 11  -  Porcentaje de UND a los que se realizó la toma de muestra inopinada
    this.chartPorcentajeUNDTomaMuestraInopinadaData = undefined;
    this.chartPorcentajeUNDTomaMuestraInopinadaLabels = [];

  // Gráfico 12: Porcentaje de total tomas de muestras inopinadas, según tamaño de la EP
    this.chartDataPorcentajeUNDConCajaRegistro = undefined;
    this.chartLabelsPorcentajeUNDConCajaRegistro  = [];

  // Gráfico 13: Porcentaje de UND que sobrepasan algún(os) parámetro(s) del Anexo N° 1
    this.chartPorcentajeUNDSobrepasanParametroAnexo1Data = undefined;
    this.chartPorcentajeUNDSobrepasanParametroAnexo1Labels = [];

  // Gráfico 14: Porcentaje de UND a los que se ha facturado por concepto de Pago adicional por exceso de concentración,

    this.chartPorcentajeUNDFacturaronPagoAdicionalData= undefined;
    this.chartPorcentajeUNDFacturaronPagoAdicionalLabels= [];


   // Gráfico 15: PPorcentaje de UND que realizaron el Pago adicional por exceso de concentración, según tamaño de la EP
   this.chartPorcentajeUNDPagoAdicionalRealizadoData = undefined;
   this.chartPorcentajeUNDPagoAdicionalRealizadoLabels= [];

  // Gráfico 16:
   this.chartPorcentajesUNDParametroAnexo2Data= undefined;
   this.chartPorcentajesUNDParametroAnexo2Labels= [];

  // Gráfico 17:
   this.chartReporteUNDPlazoAdicionalOtorgadoData= undefined;
   this.chartReporteUNDPlazoAdicionalOtorgadoLabels = [];

  // Gráfico 18:
   this.chartReportePorcentajeUNDSuscritoAcuerdoData = undefined;
   this.chartReportePorcentajeUNDSuscritoAcuerdoLabels= [];

  // Gráfico 19:
   this.chartReportePorcentajeReclamosRecibidosVMAData= undefined;
   this.chartReportePorcentajeReclamosRecibidosVMALabels= [];

   // Gráfico 20:
   this.chartreporteReclamosFundadosVMAData= undefined;
   this.chartreporteReclamosFundadosVMALabels= [];

   // Gráfico 21 y 22:
   this.chartCostoTotalConcurridoData= undefined;
   this.chartCostoTotalConcurridoLabels= [];
   this.costoTotalConcurridoList= [];

   // Gráfico 23:
   this.chartreporteCostoTotalAnualIncurridoData= undefined;
   this.chartreporteCostoTotalAnualIncurridoLabels= [];

  // Gráfico 24 y 25:
   this.chartCostoAnualMuestrasInopinadasData= undefined;
   this.chartCostoAnualMuestrasInopinadasLabels= [];
   this.CostoAnualMuestrasInopinadasList= [];

  // Gráfico 26:  //incluye la empresa sedapal
   this.chartCostoAnualIncurridoMuestrasInopinadasAllData= undefined;
   this.chartCostoAnualIncurridoMuestrasInopinadasAllLabels= [];

  //grafico 27
   this.chartCostoTotalConcurridoOtrosData= undefined;
   this.chartCostoTotalConcurridoOtrosLabels= [];

  }

  async abrir() {
    const tabsSelected = [];

    this.openedTabs.forEach(() => tabsSelected.push({selected: true}));

    const requests = [];
    tabsSelected.forEach((isOpen, index) => {
      const request = this.getReporteByIndex(index, { tabs: tabsSelected }, false);
      if (request) {
        requests.push(request);
      }
    });

    Swal.fire({
      title: "Cargando...",
      html: "Se está generando el archivo con los reportes e indicadores",
      timerProgressBar: true,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    forkJoin(requests)
      .pipe(
        tap(()=> this.activeIndex = Array.from({ length: this.openedTabs.length }, (_, i) => i)),
        delay(300),
        switchMap(() => this.crearPdf().then(() => Swal.close()))
      )
      .subscribe();
  }

  async crearPdf() {
    const pdf = new jsPDF();
    let y = 10;
    const margin = 10;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const defaultWidth = 150;

    for (let i = 0; i < this.activeIndex.length; i++) {
      const accordionElement = document.getElementById(`acc${i + 1}`);
      if (accordionElement) {
        const canvas = await html2canvas(accordionElement);
        const imgData = canvas.toDataURL('image/png');

        const imgHeight = (canvas.height * defaultWidth) / canvas.width;
        const x = (pageWidth - defaultWidth) / 2;

        // Check if the image fits on the current page
        if (y + imgHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;

          pdf.addImage(imgData, 'PNG', x, y, defaultWidth, imgHeight, undefined, 'FAST');
          y += imgHeight + margin;
        }
      }
    }

    // Save the PDF
    pdf.save('resportes-indicadores.pdf');
  }

  getReporte(tabIndex: number, accordion: any, reload?: boolean): void {
    let reporte = this.getReporteByIndex(tabIndex, accordion, reload);

    reporte.subscribe();
  }

  getReporteByIndex(tabIndex: number, accordion: any, reload?: boolean) {
    if (!reload) {
      this.openedTabs[tabIndex] = !this.openedTabs[tabIndex];
    }

    if (accordion.tabs[tabIndex].selected) {
      if (!this.openedTabs[tabIndex]) {
        return of(null); // Return an empty observable if the tab is not opened
      }

      switch (tabIndex) {
        case 0:
        case 1:
          return this.reporteService.reporteRegistros(this.selectedYear).pipe(tap(data => this.cargarDatos(data, tabIndex === 0)));
        case 2:
          return this.reporteService.reporteRespuestaSiNo(this.selectedYear).pipe(tap(data => this.cargarDatosBarChartSiNo(data)));
        case 3:
          return this.reporteService.generarReporteTrabajadoresDedicadosRegistro(this.selectedYear).pipe(tap(data => this.cargarDatosTrabajadoresDedicadosRegistro(data)));
        case 4:
          return this.reporteService.generarReporteNumeroTotalUND(this.selectedYear).pipe(tap(data => this.cargarDatosNumeroTotalUND(data)));
        case 5:
          return this.reporteService.generarReporteDiagramaUNDInspeccionados(this.selectedYear).pipe(tap(data => this.cargarDatosUNDInspeccionados(data)));
        case 6:
          return this.reporteService.generarReporteDiagramaFlujoYBalance(this.selectedYear).pipe(tap(data => this.cargarDatosDiagramaFlujoBalance(data)));
        case 7:
          return this.reporteService.generarReporteDiagramaFlujoYBalancePresentados(this.selectedYear).pipe(tap(data => this.cargatDatosDiagramaFlujoBalancePresentados(data)));
        case 8:
          return this.loadData(this.selectedYear);
        case 9:
          return this.reporteService.generarReportePorcentajeUNDConCajaRegistro(this.selectedYear).pipe(tap(data => this.cargarDatosUNDConCajaRegistro(data)));
        case 10:
          return this.reporteService.generarReportePorcentajeUNDTomaMuestraInopinada(this.selectedYear).pipe(tap(data => this.cargarDatosUNDTomaMuestraInopinada(data)));
        case 11:
          return this.reporteService.generarReporteTotalMuestrasInopinadas(this.selectedYear).pipe(tap(data => this.cargarDatosTotalMuestrasInopinadas(data)));
        case 12:
          return this.reporteService.generarReporteUNDSobrepasanParametrosAnexoUno(this.selectedYear).pipe(tap(data => this.cargarUNDSobrepasanParametrosAnexo1(data)));
        case 13:
          return this.reporteService.generarReporteUNDFacturadosPagoAdicional(this.selectedYear).pipe(tap(data => this.cargarUNDFacturasPagoAdicional(data)));
        case 14:
          return this.reporteService.generarReporteUNDPagoAdicionalRealizado(this.selectedYear).pipe(tap(data => this.cargarUNDPagoAdicionalRealizados(data)));
        case 15:
          return this.reporteService.generarReportePorcentajesTUNDParametroAnexo2(this.selectedYear).pipe(tap(data => this.cargarPorcentajesUNDParametroAnexo2(data)));
        case 16:
          return this.reporteService.generarReporteUNDPlazoAdicionalOtorgado(this.selectedYear).pipe(tap(data => this.cargarPorcentajesUNDPlazoAdicionalOtorgado(data)));
        case 17:
          return this.reporteService.generarReportePorcentajeUNDSuscritoAcuerdo(this.selectedYear).pipe(tap(data => this.cargarPorcentajesUNDSuscritoAcuerdo(data)));
        case 18:
          return this.reporteService.generarReportePorcentajeReclamosRecibidosVMA(this.selectedYear).pipe(tap(data => this.cargarPorcentajeReclamosRecibidosVMA(data)));
        case 19:
          return this.reporteService.generarReporteReclamosFundadosVMA(this.selectedYear).pipe(tap(data => this.cargarReporteReclamosFundadosVMA(data)));
        case 20:
          return this.reporteService.generarReporteCostoTotalIncurrido(this.selectedYear).pipe(tap(data => this.cargarDatosCostoTotalIncurrido(data)));
        case 21:
          return this.reporteService.generarReporteCostoTotalAnualIncurrido(this.selectedYear).pipe(tap(data => this.cargarDatosCostoAnualIncurrido(data)));
        case 22:
          return this.reporteService.generarReporteCostoAnualMuestrasInopinadas(this.selectedYear).pipe(tap(data => this.cargarDatosCostolMuestrasInopinadas(data)));
        case 23:
          return this.reporteService.generarGraficoCostoAnualIncurridoInopinadas(this.selectedYear).pipe(tap(data => this.cargarCostoAnualIncurridoMuestrasInopinadasAll(data)));
        case 24:
          return this.reporteService.generarReporteCostoTotalIncurridoOtros(this.selectedYear).pipe(tap(data => this.cargarDatosCostoTotalIncurridoOtros(data)));
        default:
          return of(null);
      }
    }

    return of(null);
  }
}
