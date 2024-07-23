import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BarChartDataset} from "../../../_model/bar-chart-dataset";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() labels: string[];
  @Input() barChartDataset: BarChartDataset[];
  @Input() esVertical: boolean = false;
  @Input() esPorcentaje: boolean = false;
  @Input() esLabelDataAfuera: boolean = false;
  @Input() colorDataLabel: string = '#FFF';
  barChartConfig: any;
  barChartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.labels || changes.barChartDataset) {
      this.initConfig();
      this.cargarDatosIniciales();
    }
  }

  private cargarDatosIniciales(): void {
    this.barChartConfig = {
      labels: this.labels,
      datasets: this.barChartDataset
    };
  }

  private initConfig(): void {
    this.barChartOptions = {
      indexAxis: this.esVertical ? 'x' : 'y',
      plugins: {
        datalabels: {
          display: true,
          color: this.colorDataLabel,
          font: {
            weight: 'bold',
            size: 16,
          },
          formatter: (value) => {
            return this.esPorcentaje ? value+'%' : value;
          },
          anchor: this.esLabelDataAfuera ? 'end' : 'center',
          align: this.esLabelDataAfuera ? 'end' : 'center',
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255,255,255,0.2)'
          },
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return this.esPorcentaje ? value+'%' : value;
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255,255,255,0.2)'
          },
          beginAtZero: true
        }
      }
    };
  }
}
