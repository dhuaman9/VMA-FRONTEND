import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReporteService } from 'src/app/_service/reporte.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  basicData: any;
  barChartOptions: any;
  title = 'GFG';
  
  isLoading = false;
  years: any[];
  selectedYear: number;
  

  chartData: any;

  pieChartData1: any;
  barChartData2: any;
  pieChartData2: any;

  chartOptions: any; // Common options for all charts
  registrosDatosBarAndPieChart: any[] = [];
  registrosSiNoChart: any[] = [];
  barChartDataSiNo: any;
  
horizontalOptions = {
  indexAxis: 'y', // This makes the bars horizontal
  plugins: {
    datalabels: {
      display: true,
      align: 'end',
      anchor: 'end',
      formatter: (value) => {
        console.log(value)
        return value.toFixed(2) + '%';
      },
      color: 'black'
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: (value) => {
          return value + '%';
        }
      }
    }
  }
};



basicData1 = {};

basicOptions = {
  plugins: {
    legend: {
      position: 'bottom'
    }
  },
  scales: {
      x: {
          grid: {
              color: 'rgba(255,255,255,0.2)'
          },
          beginAtZero: true
      },
      y: {
          grid: {
              color: 'rgba(255,255,255,0.2)'
          },
          beginAtZero: true
      }
  }
};



  constructor(
    public route : ActivatedRoute,
    private reporteService: ReporteService
  ) { 

    
    this.initializeYears();
    this.initializeCharts();
  }
  private cargarDatosBarChartSiNo(): void {
    const labels = [];
    const percentages = [];
    this.registrosSiNoChart.forEach(item => {
      labels.push(item.tipo)
      const percentage = (item.cantidadRegistradoPorEmpresa / item.cantidadTotalRegistradoPorEmpresa) * 100;
      percentages.push(percentage);
    })

    const sum = percentages.reduce((acc, curr) => acc + curr, 0);
    const averagePercentage = sum / percentages.length;
    labels.push('PROMEDIO');
    percentages.push(averagePercentage)

    this.barChartDataSiNo = {
      labels: labels,
      datasets: [{
        label: 'Porcentaje de EP con área dedicada al monitoreo y control de los VMA',
        data: percentages,
        backgroundColor: '#6fd76f',
        borderColor: '#6fd76f',
        borderWidth: 1
      }]
    };
  }

  ngOnInit(): void {

    this.initializeYears();
    this.initializeChartOptions();
    this.initializeCharts();
    this.setDefaultYear();
  }

  private cargarDatos(): void {
    const labels = [];
    const cantidadRegistradosPorEmpresa = [];
    const cantidadRegistradosPorEmpresaTotal = [];
    
    this.registrosDatosBarAndPieChart.forEach(item => {
      labels.push(item.tipo)
      cantidadRegistradosPorEmpresa.push(item.cantidadRegistradoPorEmpresa)
      cantidadRegistradosPorEmpresaTotal.push(item.cantidadTotalRegistradoPorEmpresa)
    });

    const labelsPieChart = [...labels];
    const cantidadRegistradosPorEmpresaPieChart = [...cantidadRegistradosPorEmpresa];
    labels.push('Total EP');
    cantidadRegistradosPorEmpresa.push(cantidadRegistradosPorEmpresa.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
    cantidadRegistradosPorEmpresaTotal.push(cantidadRegistradosPorEmpresaTotal.reduce((accumulator, currentValue) => accumulator + currentValue, 0));

    this.basicData1 = {
      labels: labels,
      datasets: [
          {
              label: 'EP que remitieron información',
              backgroundColor: '#42A5F5',
              data: cantidadRegistradosPorEmpresa
          },
          {
              label: 'Total EP',
              backgroundColor: '#FFA726',
              data: cantidadRegistradosPorEmpresaTotal
          }
      ]
    };

    this.pieChartData1 = {
      labels: labelsPieChart,
      datasets: [
        {
          data: cantidadRegistradosPorEmpresaPieChart,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#ffa726',
            '#6fd76f'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#ffa726',
            '#6fd76f'
          ]
        }
      ]
    };
  }


  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 2022; year--) {
      this.years.push({ label: year.toString(), value: year });
    }
  }

  initializeCharts() {

    this.chartData = [
      { label: 'Category 1', value: 120 },
      { label: 'Category 2', value: 80 },
      { label: 'Category 3', value: 50 },
      { label: 'Category 4', value: 30 },
      { label: 'Category 5', value: 10 },
    ];

    /*this.barChartData2 = {
      labels: ['Label A', 'Label B', 'Label C'],
      datasets: [
        {
          label: 'Dataset A',
          backgroundColor: '#66BB6A',
          data: [75, 69, 90]
        },
        {
          label: 'Dataset B',
          backgroundColor: '#FFCA28',
          data: [38, 58, 50]
        }
      ]
    };*/

    this.barChartData2 = {
      labels: ['Label A', 'Label B', 'Label C'],
      datasets: [
        {
          label: 'Dataset A',
          backgroundColor: '#66BB6A',
          data: [75, 69, 90]
        }
      ]
    };

    this.pieChartData2 = {
      labels: ['Label A', 'Label B', 'Label C'],
      datasets: [
        {
          data: [200, 150, 250],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56'
          ]
        }
      ]
    };
  }


  
  initializeChartOptions() {

    this.chartOptions = {
      responsive: true, // Make chart responsive
      indexAxis: 'y',
      plugins: {
          legend: {
              labels: {
                  color: '#000000' // Use hex code for black color
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#000000' // Use hex code for black color
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.2)'
              }
          },
          y: {
              ticks: {
                  color: '#000000' // Use hex code for black color
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.2)'
              }
          }
      }
    };

    /*this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      },
      legend: {
        position: 'top'
      },
      // Invertir las barras horizontalmente
      scalesOverride: {
        xAxes: [{
          horizontalBars: true,
          categoryPercentage: 0.5,
          barPercentage: 0.8
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    };*/
  }


  applyFilter() {
    this.reporteService.reporteRegistros(this.selectedYear).subscribe(data => {
      this.registrosDatosBarAndPieChart = data.items;
      this.cargarDatos();
    });

    this.reporteService.reporteRespuestaSiNo(this.selectedYear).subscribe(data => {
      this.registrosSiNoChart = data.items;
      this.cargarDatosBarChartSiNo();
    })
    console.log('Selected Year:', this.selectedYear);
  }

  setDefaultYear() {
    this.selectedYear = new Date().getFullYear();
  }
}
