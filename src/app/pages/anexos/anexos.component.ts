import {Component, OnDestroy, OnInit} from '@angular/core';
import {AnexoService} from "../../_service/anexo.service";
import {Subject, Subscription} from "rxjs";
import {AnexoRegistro} from "../../_model/anexo-registro";
import {takeUntil, tap} from "rxjs/operators";
import {AnexoRespondieronSi} from "../../_model/anexo-respondieron-si";
import { AnexoUNDRegistrados } from 'src/app/_model/anexo-eps-inspeccionados';
import { AnexoTomaMuestrasInopinadas } from 'src/app/_model/anexo-muestras-inopinadas';
import { AnexoEvaluacionVmaAnexo1 } from 'src/app/_model/anexo-ep-evaluacion-vma-anexo1';
import { AnexoEvaluacionVmaAnexo2 } from 'src/app/_model/anexo-ep-evaluacion-vma-anexo2';
import { AnexoEPAtenciondeReclamosVMA } from 'src/app/_model/anexo-ep-reclamos-vma-dto';

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
  unsubscribe$: Subject<void> = new Subject<void>();

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
    this.anexoService.getListAnexoRegistrosVMA(this.selectedYear)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(response => this.anexoRegistros = this.processAnexoRegistros(response))
      ).subscribe();

      //anexo 2
    this.anexoService.getListAnexoMarcaronSi(this.selectedYear)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(response => this.anexoRespondieronSi = this.processAnexoRegistros(response))
      ).subscribe();

      //anexo 3
    this.anexoService.getListAnexoUNDregistrados(this.selectedYear)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(response => this.anexoUNDregistrados = this.processAnexoRegistros(response))
    ).subscribe();

     //anexo 4
    this.anexoService.getListAnexoTomaMuestrasInopinadas(this.selectedYear)
    .pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.anexoTomaMuestrasInopinadas = this.processAnexoRegistros(response))
    ).subscribe();

     //anexo 5
    this.anexoService.getListAnexoEPRealizaronEvaluacionVMAAnexo1(this.selectedYear)
    .pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.anexoEvaluacionVmaAnexo1 = this.processAnexoRegistros(response))
    ).subscribe();

     //anexo 6
    this.anexoService.getListAnexoEPRealizaronEvaluacionVMAAnexo2(this.selectedYear)
    .pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.anexoEvaluacionVmaAnexo2 = this.processAnexoRegistros(response))
    ).subscribe();

    //anexo 7
    this.anexoService.getListAnexoAtenciondeReclamosVMA(this.selectedYear)
    .pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.anexoEPAtenciondeReclamosVMA = this.processAnexoRegistros(response))
    ).subscribe();

    /*
     this.anexoService.getListAnexoTomaMuestrasInopinadas(this.selectedYear)
    .pipe(
      takeUntil(this.unsubscribe$),
      tap(response => this.anexoTomaMuestrasInopinadas = this.processAnexoRegistros(response))
    ).subscribe();
    */

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

  ngOnDestroy(): void {
    if(this.suscription) {
      this.suscription.unsubscribe();
    }
  }
}
