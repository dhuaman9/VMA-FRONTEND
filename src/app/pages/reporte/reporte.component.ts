import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  barChartData1: any;

  chartData: any;

  pieChartData1: any;
  barChartData2: any;
  pieChartData2: any;

  chartOptions: any; // Common options for all charts

  
horizontalOptions = {
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



  constructor(
    public route : ActivatedRoute,
  ) { 

    this.initializeYears();
    this.initializeCharts();
  }

  ngOnInit(): void {

    this.initializeYears();
    this.initializeChartOptions();
    this.initializeCharts();
    this.setDefaultYear();
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


    this.barChartData1 = {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
     datasets: [
        {
            label: 'Orders on Swiggy',
            backgroundColor: 'green',
            data: [66, 49, 81, 71, 26, 65, 60]
        },
        {
            label: 'Orders on Zomato',
            backgroundColor: 'red',
            data: [56, 69, 89, 61, 36, 75, 50]
        }
    ]
    };

    this.pieChartData1 = {
      labels: ['Label 1', 'Label 2', 'Label 3'],
      datasets: [
        {
          data: [300, 50, 100],
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
    // Implement the filter logic here
    console.log('Selected Year:', this.selectedYear);
  }

  setDefaultYear() {
    this.selectedYear = new Date().getFullYear();
  }

  

}
