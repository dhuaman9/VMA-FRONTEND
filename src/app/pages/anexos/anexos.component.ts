import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnexoService} from "../../_service/anexo.service";
import {Subscription} from "rxjs";
import {AnexoRegistro} from "../../_model/anexo-registro";
import {tap} from "rxjs/operators";

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

  constructor(private anexoService: AnexoService) {
    this.initializeYears();
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
    this.suscription = this.anexoService.getListAnexoRegistrosVMA(this.selectedYear)
      .pipe(tap(response => this.anexoRegistros = this.processAnexoRegistros(response.items)))
      .subscribe();
  }

  setDefaultYear(): void {
    this.selectedYear = new Date().getFullYear();
  }

  processAnexoRegistros(data: AnexoRegistro[]): any[] {
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

  ngOnDestroy(): void {
    if(this.suscription) {
      this.suscription.unsubscribe();
    }
  }
}