import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { ReporteParamCalidadDto } from 'src/app/_dto/reporteParamCalidadDto';
import { ReporteParamCalidadExportDto } from 'src/app/_dto/reporteParamCalidadExportDto';
import { ReporteService } from 'src/app/_service/reporte.service';
import { UtilsService } from 'src/app/_service/utils.service';

declare const attachEventsToTabInRepParamCalidad: any;
declare const clearAllTableRepParamCalidad: any;
declare const createTableTotal: any;
declare const createTableSatisfactorio: any;


@Component({
  selector: 'app-reportes-parametro-calidad',
  templateUrl: './reportes-parametro-calidad.component.html',
  styleUrls: ['./reportes-parametro-calidad.component.css']
})
export class ReportesParametroCalidadComponent implements OnInit {

  private reporteParamCalidadDto  : ReporteParamCalidadDto;
  private reporteParamCalidadExportDto  : ReporteParamCalidadExportDto;
  isLoading = false;

  optionsParametro: any;
  optionsAnio: any;

  infoTotalOptionsParametro: any;

  inputSelectedOptionParametro: string;
  inputSelectedOptionAnio: string;

  form: FormGroup;

  messageErrorParametro: string;
  messageErrorAnio: string;

  resultadosReporteTotal : any;
  resultadosReporteSatisfactorio : any;

  showResultadosReporte = false;

  anioLast: number = new Date().getFullYear();

  parametroId: string = '';
  anioId;

  messageFecProcesa:string = "";

  constructor(
    public route : ActivatedRoute,
    private reporteService : ReporteService,
    private utilsService : UtilsService,
    private formBuilder: FormBuilder
  ) { 

    this.form = this.formBuilder.group({
      anio: [null, []],
      parametro: [null, []],
    });

    const defaultYear  = this.anioLast.toString();

    this.inputSelectedOptionParametro = null;
    this.inputSelectedOptionAnio      = defaultYear;

    this.changeAnioFromSelect(defaultYear);

    this.messageErrorParametro = null;
    this.messageErrorAnio      = null;
  }

  ngOnInit(): void {
    this.initFrmReporte();
  }

  initFrmReporte(){

    this.isLoading = true;

    this.reporteParamCalidadDto = {
      anio: 2023,
      codParam: '0200',
      pestana: 'total'
    }

    this.reporteParamCalidadExportDto = {
      anio: 2023,
      codParam: '0200'
    }

    const listServices$ = [ 
      this.reporteService.listaparametros(),
      this.reporteService.fechaprocesa()
    ];

    forkJoin(listServices$).subscribe(
      ([datalist, datafecha]) => {

        this.infoTotalOptionsParametro = datalist;

        this.optionsParametro =  datalist;

        this.optionsParametro.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );

        if(datafecha.value){
          this.messageFecProcesa = "Información procesada al : "+datafecha.value;
        }

        this.isLoading = false;
      }
    );
    
    let tmpAnioToFrm = [];
    let tmpAnioBase: number  = 2012;
    while (tmpAnioBase <= this.anioLast) {

      tmpAnioToFrm.push({
          id: tmpAnioBase,
          name: tmpAnioBase
        }
      );

      tmpAnioBase++;
    }

    tmpAnioToFrm.sort((a,b) => (a.name < b.name) ? 1 : -1);

    this.optionsAnio = tmpAnioToFrm;

  }

  validarReporte() {
    let result = true;
    this.messageErrorParametro = null;
    this.messageErrorAnio = null;

    if (this.form.value.parametro == null) {
      this.messageErrorParametro = '* Campo obligatorio.';
      result = false;
    }
    if (this.form.value.anio == null) {
      this.messageErrorAnio = '* Campo obligatorio.';
      result = false;
    }

    return result;
  }

  obtenerReporte(){

    this.showResultadosReporte = false;

    if (!this.validarReporte()) return;

    this.resultadosReporteTotal    = [];
    this.resultadosReporteSatisfactorio = [];

    clearAllTableRepParamCalidad();

    if (
      this.form.value.anio != null &&
      this.form.value.parametro != null
    )
    {

      this.isLoading = true;

      this.parametroId = this.form.value.parametro;
      this.anioId     = this.form.value.anio;

      this.reporteParamCalidadDto.anio     = this.anioId;
      this.reporteParamCalidadDto.codParam = this.parametroId;
      this.reporteParamCalidadDto.pestana  = 'total';

      const listServices$ = [ 
        this.reporteService.parametroscalidad(
          {
            anio: this.anioId,
            codParam: this.parametroId,
            pestana: 'total'
          }
        ),
        this.reporteService.parametroscalidad(
          {
            anio: this.anioId,
            codParam: this.parametroId,
            pestana: 'satisfactorio'
          }
        )
      ];

      forkJoin(listServices$).subscribe(
        ([datatotal, datasatisfactorio]:any)=>{

        let flagSuccess = true;

        if(datatotal.success){

          if(datatotal.total == 0){
            this.resultadosReporteTotal = [];
          }
          else{
            this.resultadosReporteTotal = datatotal.items;

            createTableTotal();
          }
        }
        else{
          flagSuccess = false;
        }

        if(datasatisfactorio.success){
          
          if(datasatisfactorio.total == 0){
            this.resultadosReporteSatisfactorio = [];
          }
          else{
            this.resultadosReporteSatisfactorio = datasatisfactorio.items;

            createTableSatisfactorio();
          }
        }
        else{
          flagSuccess = false;
        }

        if(flagSuccess){

          this.showResultadosReporte = true;

          attachEventsToTabInRepParamCalidad();

          this.isLoading = false;
        }
        
      });
    }

  }

  exportReporte(){
    
    if (!this.validarReporte()) return;

    if (
      this.form.value.anio != null &&
      this.form.value.parametro != null
    )
    {
      this.isLoading = true;

      this.reporteParamCalidadExportDto.anio     = this.form.value.anio;
      this.reporteParamCalidadExportDto.codParam = this.form.value.parametro;

      let infoParametro = this.infoTotalOptionsParametro.find((it) => { return it.code == this.form.value.parametro});

      let nameElementFormat = this.utilsService.formatStrToExcel(infoParametro.name);

      this.reporteService.exportparametroscalidad(this.reporteParamCalidadExportDto).subscribe(data=>{
        var fileURL = window.URL.createObjectURL(data);
        var a = document.createElement("a");
        a.href = fileURL;
        a.download = 'RPC_'+nameElementFormat+'_'+this.reporteParamCalidadExportDto.anio;
        a.click();
        
        this.isLoading = false;
      });
      
    }
  }

  changeParametroFromSelect = (e) => {
    this.form.controls['parametro'].setValue(e);
    this.messageErrorParametro = null;
    this.showResultadosReporte = false;
  }

  changeAnioFromSelect = (e) => {
    this.form.controls['anio'].setValue(e);
    this.messageErrorAnio = null;
    this.showResultadosReporte = false;
  }
}
