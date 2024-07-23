import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReporteService } from 'src/app/_service/reporte.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
import {BarChartDataset} from "../../_model/bar-chart-dataset";
import {ChartDto} from "../../_model/chart-dto";

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

  chartDataNumeroEP: number[] = [];
  chartLabelsNumeroEP: string[] = [];

  chartDataRemisionInfo: BarChartDataset[] = [];
  chartLabelsRemisionInfo: string[] = [];

  chartDataSiNo: BarChartDataset[] = [];
  chartLabelsSiNo: string[] = [];

  constructor(
    public route : ActivatedRoute,
    private reporteService: ReporteService
  ) {
    this.initializeYears();
  }

  ngOnInit(): void {
    this.setDefaultYear();//cargara el año actual
    this.applyFilter(); //cargara por defecto los graficos del año actual
  }

  private cargarDatosBarChartSiNo(registrosSiNoChart: ChartDto[]): void {
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

  private cargarDatos(registrosDatosBarAndPieChart: ChartDto[]): void {
    let labels: string[] = [];
    let cantidadRegistradosPorEmpresa: number[] = [];
    let cantidadRegistradosPorEmpresaTotal: number[] = [];

    registrosDatosBarAndPieChart.forEach(item => {
      labels.push(item.tipo)
      cantidadRegistradosPorEmpresa.push(item.cantidadRegistradoPorEmpresa)
      cantidadRegistradosPorEmpresaTotal.push(item.cantidadTotalRegistradoPorEmpresa)
    });

    this.cargarChartNumero2(labels, cantidadRegistradosPorEmpresa);
    this.cargarChartNumero1([...cantidadRegistradosPorEmpresa], [...cantidadRegistradosPorEmpresaTotal], [...labels]);
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


  private initializeYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 2022; year--) {
      this.years.push({ label: year.toString(), value: year });
    }
  }

  applyFilter(): void {
    this.reporteService.reporteRegistros(this.selectedYear).subscribe(data => {
      this.cargarDatos(data);
    });

    this.reporteService.reporteRespuestaSiNo(this.selectedYear).subscribe(data => {
      this.cargarDatosBarChartSiNo(data);
    });
  }

  private setDefaultYear() {
    this.selectedYear = new Date().getFullYear();
  }
}
