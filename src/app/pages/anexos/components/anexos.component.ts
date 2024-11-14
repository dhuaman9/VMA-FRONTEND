import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnexoService} from "src/app/pages/anexos/services/anexo.service";
import {Subject, Subscription} from "rxjs";
import {AnexoRegistro} from "src/app/pages/anexos/models/anexo-registro";
import {takeUntil, tap} from "rxjs/operators";
import {AnexoRespondieronSi} from "src/app/pages/anexos/models/anexo-respondieron-si";
import { AnexoUNDRegistrados } from 'src/app/pages/anexos/models/anexo-eps-inspeccionados';
import { AnexoTomaMuestrasInopinadas } from 'src/app/pages/anexos/models/anexo-muestras-inopinadas';
import { AnexoEvaluacionVmaAnexo1 } from 'src/app/pages/anexos/models/anexo-ep-evaluacion-vma-anexo1';
import { AnexoEvaluacionVmaAnexo2 } from 'src/app/pages/anexos/models/anexo-ep-evaluacion-vma-anexo2';
import { AnexoEPAtenciondeReclamosVMA } from 'src/app/pages/anexos/models/anexo-ep-reclamos-vma';
import { AnexoCostoTotalMuestrasInopinadas } from 'src/app/pages/anexos/models/anexo-costo-total-muestras-inopinadas';
import { AnexoCostosUND } from 'src/app/pages/anexos/models/anexo-costos-und';
import { AnexoCostoTotalesIncurridos } from 'src/app/pages/anexos/models/anexo-costo_totales-incurridos';
import { AnexoIngresos } from 'src/app/pages/anexos/models/anexo-ingresos';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-anexos',
  templateUrl: './anexos.component.html',
  styleUrls: ['./anexos.component.css']
})
export class AnexosComponent implements OnInit, OnDestroy {
  years: {label: string, value: number}[];
  selectedYear: number;
  suscription: Subscription;

  anexoRegistros: AnexoRegistro[] = [];
  anexoRespondieronSi: AnexoRespondieronSi[] = [];
  anexoUNDregistrados: AnexoUNDRegistrados[] = [];
  anexoTomaMuestrasInopinadas: AnexoTomaMuestrasInopinadas[] = [];
  anexoEvaluacionVmaAnexo1: AnexoEvaluacionVmaAnexo1[] = [];
  anexoEvaluacionVmaAnexo2: AnexoEvaluacionVmaAnexo2[] = [];
  anexoEPAtenciondeReclamosVMA: AnexoEPAtenciondeReclamosVMA[] = [];
  anexoCostosUND: AnexoCostosUND[] = [];
  anexoCostoTotalMuestrasInopinadas: AnexoCostoTotalMuestrasInopinadas[] = [];
  anexoCostoTotalesIncurridos: AnexoCostoTotalesIncurridos[] = [];
  anexoIngresos: AnexoIngresos[] = [];

  unsubscribe$: Subject<void> = new Subject<void>();

  openedTabs: boolean[] = [false, false,false,false,false,false,false,false,false,false,false];

  constructor(private anexoService: AnexoService) {
    this.initializeYears();
  }

  downloadPDF(headers: string[], dataList: any[]): void {
    const doc = new jsPDF();
    this.generatePDF(doc, dataList, headers);
    doc.save('table-data.pdf');
  }

  generatePDF(doc: jsPDF, dataArray: any[], headers: string[]): void {
    const headersTable = [headers.map(field => this.primeraLetraMayuscula(field))];

    const data = dataArray.map(item =>
      Object.keys(item).map(key => this.formatData(item, key))
    );

    autoTable(doc, {
      head: headersTable,
      body: data,
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        halign: 'center',
        valign: 'middle',
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
      },
    });
  }

  primeraLetraMayuscula(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatData(item: any, key: string): string | number {
    if (key in item) {
      const value = item[key];
      if (typeof value === 'boolean') {
        return value ? 'SI' : 'NO';
      }
      return value;
    }
    return '';
  }

  ngOnInit(): void {
    this.applyFilter();
  }

  initializeYears(): void {
    this.setDefaultYear();
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 2022; year--) {
      this.years.push({ label: year.toString(), value: year });
    }
  }

  applyFilter(): void {
    this.cleanData();
    this.reloadOpenedTabs();
  }


  onTabOpen(tabIndex: number, accordion: any, reload?: boolean) {
    if(!reload) {
      this.openedTabs[tabIndex] = !this.openedTabs[tabIndex];
    }

    if (accordion.tabs[tabIndex].selected) {
      switch (tabIndex) {
        case 0:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoRegistrosVMA(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => this.anexoRegistros = this.processAnexoRegistros(response))
            ).subscribe();
          }
        break;
        case 1:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoMarcaronSi(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => this.anexoRespondieronSi = this.processAnexoRegistros(response))
            ).subscribe();
          }
        break;
        case 2:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoUNDregistrados(this.selectedYear)
              .pipe(
                takeUntil(this.unsubscribe$),
                tap(response => this.anexoUNDregistrados = this.processAnexoRegistros(response))
            ).subscribe();

          }
        break;
        case 3:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoTomaMuestrasInopinadas(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => this.anexoTomaMuestrasInopinadas = this.processAnexoRegistros(response))
            ).subscribe();
          }
        break;
        case 4:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoEPRealizaronEvaluacionVMAAnexo1(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => this.anexoEvaluacionVmaAnexo1 = this.processAnexoRegistros(response))
            ).subscribe();
          }
        break;
        case 5:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoEPRealizaronEvaluacionVMAAnexo2(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => this.anexoEvaluacionVmaAnexo2 = this.processAnexoRegistros(response))
            ).subscribe();
          }
        break;
        case 6:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoAtenciondeReclamosVMA(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => this.anexoEPAtenciondeReclamosVMA = this.processAnexoRegistros(response))
            ).subscribe();
          }
        break;
        case 7:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoCostosUND(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => {
                // Procesar los registros y formatear los ingresos
                this.anexoCostosUND = this.processAnexoRegistros(response).map(anexo => {
                  return {
                    ...anexo,
                    costoTotalUND: this.formatNumberWithSpaces(anexo.costoTotalUND),
                    costoAnualPorUND:this.formatNumberWithSpaces(anexo.costoAnualPorUND),
                  };
                });
              })

            ).subscribe();
          }
        break;
        case 8:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoCostosTotalesxMuestrasInopinadas(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => {
                // Procesar los registros y formatear los ingresos
                this.anexoCostoTotalMuestrasInopinadas = this.processAnexoRegistros(response).map(anexo => {
                  return {
                    ...anexo,
                    costoPorTomaMuestrasInopinadas: this.formatNumberWithSpaces(anexo.costoPorTomaMuestrasInopinadas),
                    costoAnualMuestraInopinada:this.formatNumberWithSpaces(anexo.costoAnualMuestraInopinada),
                  };
                });
              })

            ).subscribe();
          }
        break;
        case 9:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoDetalleCostosTotalesIncurridos(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => {
                // Procesar los registros y formatear los ingresos
                this.anexoCostoTotalesIncurridos = this.processAnexoRegistros(response).map(anexo => {
                  return {
                    ...anexo,
                    costoIdentInspeccionRegistroUND: this.formatNumberWithSpaces(anexo.costoIdentInspeccionRegistroUND),
                    costoMuestrasInopinadas:this.formatNumberWithSpaces(anexo.costoMuestrasInopinadas),
                    costosOtrosGastosImplementacion:this.formatNumberWithSpaces(anexo.costosOtrosGastosImplementacion),
                  };
                });
              })

            ).subscribe();
          }
        break;
        case 10:
          if (this.openedTabs[tabIndex]) {
            this.anexoService.getListAnexoIngresosVMA(this.selectedYear)
            .pipe(
              takeUntil(this.unsubscribe$),
              tap(response => {
                // Procesar los registros y formatear los ingresos
                this.anexoIngresos = this.processAnexoRegistros(response).map(anexo => {
                  return {
                    ...anexo,
                    ingresosVma: this.formatNumberWithSpaces(anexo.ingresosVma)
                  };
                });
              })
            ).subscribe();
          }
        break;
      }
    }
  }

  filterText: string = '';


  filterTabs(header: string, content: string): boolean {
    if (!this.filterText) {
      return true;
    }

    const searchText = this.filterText.toLowerCase();
    return header.toLowerCase().includes(searchText) || content.toLowerCase().includes(searchText);
  }




  setDefaultYear(): void {
    this.selectedYear = new Date().getFullYear();
  }

  processAnexoRegistros(data: any[]): any[] {
    if(data.length === 0) {
      return [];
    }

    const processedData = [];
    let previousTamanioEmpresa = null;
    let rowspan = 1;

    for (let i = 0; i < data.length; i++) {
      const anexo = { ...data[i] };

      if (i > 0 && data[i].tamanioEmpresa === previousTamanioEmpresa) {
        rowspan++;
      } else {
        if (i > 0) {
          processedData[i - rowspan].rowspan = rowspan;
        }
        previousTamanioEmpresa = data[i].tamanioEmpresa;
        rowspan = 1;
      }
      processedData.push(anexo);
    }
    processedData[data.length - rowspan].rowspan = rowspan;

    return processedData;
  }

  formatNumberWithSpaces(num: number): string {
    var rounded = num.toFixed(2);
    var [integerPart, decimalPart] = rounded.split('.');
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${integerPart}.${decimalPart}`;
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

  cleanData(): void {

    this.anexoRespondieronSi = [];
    this.anexoUNDregistrados = [];
    this.anexoTomaMuestrasInopinadas= [];
    this.anexoEvaluacionVmaAnexo1 = [];
    this.anexoEvaluacionVmaAnexo2 = [];
    this.anexoEPAtenciondeReclamosVMA = [];
    this.anexoCostosUND = [];
    this.anexoCostoTotalMuestrasInopinadas = [];
    this.anexoCostoTotalesIncurridos = [];
    this.anexoIngresos = [];
  }


  ngOnDestroy(): void {
    if(this.suscription) {
      this.suscription.unsubscribe();
    }
  }
}
