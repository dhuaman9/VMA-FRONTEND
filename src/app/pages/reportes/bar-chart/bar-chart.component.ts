import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BarChartDataset} from "../models/bar-chart-dataset";

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
  @Input() tieneDecimalesDataLabel: boolean = false;
  @Input() tieneDecimalesLabel: boolean = false;
  @Input() maximoX: number;
  @Input() stepSize: number;
  @Input() moneda: string;
  @Input() ultimaBarrAdentro: boolean;
  barChartConfig: any;
  barChartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.initConfig();
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
            size: 14,
          },
          formatter: (value) => {
            return this.esPorcentaje ? value.toFixed(this.tieneDecimalesDataLabel ? 2 : 0)+'%' : (this.moneda || '')+value.toFixed(this.tieneDecimalesDataLabel ? 2 : 0);
          },
          anchor: (context) => {
            const index = context.dataIndex;
            const dataset = context.dataset;

            if (this.ultimaBarrAdentro && index === dataset.data.length - 1) {
              return 'center';
            }

            return this.esLabelDataAfuera ? 'end' : 'center';
          },
          align: (context) => {
            const index = context.dataIndex;
            const dataset = context.dataset;

            if (this.ultimaBarrAdentro && index === dataset.data.length - 1) {
              return 'center';
            }

            return this.esLabelDataAfuera ? 'end' : 'center';
          },
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

    if(!this.esVertical) {
      this.barChartOptions.scales.x.ticks = {
        callback: (value) => {
          return this.esPorcentaje ? value.toFixed(this.tieneDecimalesLabel ? 2 : 0)+'%' : (this.moneda||'')+value.toFixed(this.tieneDecimalesLabel ? 2 : 0);
        }
      }
    } else {
      this.barChartOptions.scales.y.ticks = {
        callback: (value) => {
          return this.esPorcentaje ? value.toFixed(this.tieneDecimalesLabel ? 2 : 0)+'%' : (this.moneda||'')+value.toFixed(this.tieneDecimalesLabel ? 2 : 0);
        }
      }
    }

    if (this.maximoX) {
      this.barChartOptions.scales.x.max = this.maximoX;
    }

    if(this.stepSize) {
      if(this.esVertical) {
        this.barChartOptions.scales.y.ticks.stepSize = this.stepSize;
      } else {
        this.barChartOptions.scales.x.ticks.stepSize = this.stepSize;
      }

    }
  }
}