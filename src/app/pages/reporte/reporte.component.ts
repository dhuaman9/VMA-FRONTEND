import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReporteService } from 'src/app/_service/reporte.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import {BarChartDataset} from "../../_model/bar-chart-dataset";
import {ChartDto} from "../../_model/chart-dto";
import {RegistroPromedioTrabajadorVMAChartDto} from "../../_model/RegistroPromedioTrabajadorVMAChartDto";
import {PieChartBasicoDto} from "../../_model/pie-chart-basico-dto";
import {BarChartBasicoDto} from "../../_model/bar-chart-basico-dto";

//npm install chartjs-plugin-datalabels
Chart.register(ChartDataLabels);

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

  //falta para el grafico 9

  //grafico 10  -  Porcentaje de UND que cuentan con caja de registro
  chartPorcentajeUNDConCajaRegistroData: BarChartDataset[];
  chartPorcentajeUNDConCajaRegistroLabels: string[] = [];

  //grafico 11  -  Porcentaje de UND a los que se realizó la toma de muestra inopinada
  chartPorcentajeUNDTomaMuestraInopinadaData: BarChartDataset[];
  chartPorcentajeUNDTomaMuestraInopinadaLabels: string[] = [];

  // Gráfico 12: Porcentaje de total tomas de muestras inopinadas, según tamaño de la EP 
  chartDataPorcentajeUNDConCajaRegistro: number[];
  chartLabelsPorcentajeUNDConCajaRegistro: string[] = [];

  //es necesario , agregar nuevo false, si en caso haya nuevos tabs , la cantidad en el array depende del # de gráficos 
  openedTabs: boolean[] = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

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
      backgroundColor: '#6fd76f',
      data: data.map(item => item.value)
    });
  }

  //10 UND que cuentan con caja de registro
  private cargarDatosUNDConCajaRegistro = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDConCajaRegistroData = [];
    this.chartPorcentajeUNDConCajaRegistroLabels = data.map(item => item.label);
    this.chartPorcentajeUNDConCajaRegistroData.push({
      label: 'Porcentaje de UND que cuentan con caja de registro o dispositivo en la parte externa de su predio. ',
      backgroundColor: '#6fd76f',
      data: data.map(item => item.value)
    });
  }

   //11  Porcentaje de UND a los que se realizó la toma de muestra inopinada
   private cargarDatosUNDTomaMuestraInopinada = (data: BarChartBasicoDto[]): void => {
    this.chartPorcentajeUNDTomaMuestraInopinadaData = [];
    this.chartPorcentajeUNDTomaMuestraInopinadaLabels = data.map(item => item.label);
    this.chartPorcentajeUNDTomaMuestraInopinadaData.push({
      label: 'Porcentaje de UND a los que se realizó la toma de muestra inopinada, según tamaño de EPS. ',
      backgroundColor: '#6fd76f',
      data: data.map(item => item.value)
    });
  }

   //12 Porcentaje de toma de muestra inopinada, según tamaño de la EP  
   

  private cargarDatosTotalMuestrasInopinadas = (data: PieChartBasicoDto[]): void => {
    this.chartLabelsPorcentajeUNDConCajaRegistro = data.map(item => item.label);
    this.chartDataPorcentajeUNDConCajaRegistro = data.map(item => item.cantidad);
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
    this.openedTabs.forEach((isOpen, index) => {
      tabsSelected.push({selected: isOpen})
    });

    tabsSelected.forEach((isOpen, index) => {
      if (isOpen) {
        this.onTabOpen(index, { tabs: tabsSelected }, true);
      }
    })
  }

  onTabOpen(tabIndex: number, accordion: any, reload?: boolean) {
    if(!reload) {
      this.openedTabs[tabIndex] = !this.openedTabs[tabIndex];
    }

    if (accordion.tabs[tabIndex].selected) {
      switch (tabIndex) {
        case 0:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.reporteRegistros(this.selectedYear).subscribe(data => this.cargarDatos(data, true));
          }
          break;
        case 1:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.reporteRegistros(this.selectedYear).subscribe(data => this.cargarDatos(data, false));
          }
          break;
        case 2:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.reporteRespuestaSiNo(this.selectedYear).subscribe(this.cargarDatosBarChartSiNo);
          }
          break;
        case 3:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.generarReporteTrabajadoresDedicadosRegistro(this.selectedYear).subscribe(this.cargarDatosTrabajadoresDedicadosRegistro);
          }
          break;
        case 4:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.generarReporteNumeroTotalUND(this.selectedYear).subscribe(this.cargarDatosNumeroTotalUND);
          }
          break;
        case 5:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.generarReporteDiagramaUNDInspeccionados(this.selectedYear).subscribe(this.cargarDatosUNDInspeccionados); //dhr
          }
          break;
        case 6:
            if (this.openedTabs[tabIndex]) {
              this.reporteService.generarReporteDiagramaFlujoYBalance(this.selectedYear).subscribe(this.cargarDatosDiagramaFlujoBalance);
            }
        break;
        case 7:
            if (this.openedTabs[tabIndex]) {
              this.reporteService.generarReporteDiagramaFlujoYBalancePresentados(this.selectedYear).subscribe(this.cargatDatosDiagramaFlujoBalancePresentados);
            }
        break;
        case 9:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.generarReportePorcentajeUNDConCajaRegistro(this.selectedYear).subscribe(this.cargarDatosUNDConCajaRegistro);
          }
        break;
        case 10:
            if (this.openedTabs[tabIndex]) {
              this.reporteService.generarReportePorcentajeUNDTomaMuestraInopinada(this.selectedYear).subscribe(this.cargarDatosUNDTomaMuestraInopinada);
            }
        break;
        case 11:
          if (this.openedTabs[tabIndex]) {
            this.reporteService.generarReporteTotalMuestrasInopinadas(this.selectedYear).subscribe(this.cargarDatosTotalMuestrasInopinadas);
          }
        break;
      }
    }
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
  }
}
