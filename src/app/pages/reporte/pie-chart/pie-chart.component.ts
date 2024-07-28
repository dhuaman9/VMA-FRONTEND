import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnChanges {
  @Input() data: number[];
  @Input() labels: string[];
  @Input() esPorcentaje: boolean = false;
  @Input() tieneDecimalesDataLabel: boolean = false;

  pieChartConfig = {};
  chartOptions = {};

  constructor() { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.labels || changes.data) {
      this.cargarDatos();
    }
  }

  private cargarDatos(): void {
    this.pieChartConfig = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
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

    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        },
        datalabels: {
          display: true,
          color: 'white',
          font: {
            weight: 'bold',
            size: 16,
          },
          formatter: (value) => {
            return this.esPorcentaje ? value.toFixed(this.tieneDecimalesDataLabel ? 2 : 0)+'%' : value.toFixed(this.tieneDecimalesDataLabel ? 2 : 0);
          }
        }
      }
    };
  }
}
