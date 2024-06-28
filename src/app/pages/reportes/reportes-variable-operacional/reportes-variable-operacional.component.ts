import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ReporteVarOperacionalDto } from 'src/app/_dto/reporteVarOperacionalDto';
import { ReporteService } from 'src/app/_service/reporte.service';

declare const attachEventsToTabInRepVarOperacional: any;
declare const clearAllTableRepVarOperacional: any;
declare const createTableLocalidadPresion: any;
declare const createTableLocalidadContinuidad: any;
declare const createTableSector: any;

@Component({
  selector: 'app-reportes-variable-operacional',
  templateUrl: './reportes-variable-operacional.component.html',
  styleUrls: ['./reportes-variable-operacional.component.css']
})
export class ReportesVariableOperacionalComponent implements OnInit {

  private reporteVarOperacionalDto  : ReporteVarOperacionalDto;
  isLoading = false;

  optionsVariable: any;
  optionsAnio: any;
  optionsNivel: any;

  inputSelectedOptionVariable: string;
  inputSelectedOptionAnio: string;
  inputSelectedOptionNivel: string;

  form: FormGroup;

  messageErrorVariable: string;
  messageErrorAnio: string;
  messageErrorNivel: string;

  resultadosReporteLocalidadPresion : any;
  resultadosReporteLocalidadContinuidad : any;
  resultadosReporteSectorPresion : any;
  resultadosReporteSectorContinuidad : any;

  showResultadosReporte = false;

  anioLast: number = new Date().getFullYear();

  anioCode;
  nivelCode;
  variableCode;

  messageFecProcesa:string = "";

  constructor(
    public route : ActivatedRoute,
    private reporteService : ReporteService,
    private formBuilder: FormBuilder,
    private elementRef:ElementRef
  ) { 

    this.form = this.formBuilder.group({
      anio: [null, []],
      variable: [null, []],
      nivel: [null, []],
    });

    const defaultYear  = this.anioLast.toString();
    const defaultNivel = 'Localidad';

    this.inputSelectedOptionVariable = null;
    this.inputSelectedOptionAnio     = defaultYear;
    this.inputSelectedOptionNivel    = defaultNivel;

    this.changeAnioFromSelect(defaultYear);
    this.changeNivelFromSelect(defaultNivel);

    this.messageErrorVariable = null;
    this.messageErrorAnio     = null;
    this.messageErrorNivel    = null;
  }

  ngOnInit(): void {
    this.initFrmReporte();
  }

  ngAfterViewInit() {
  
  }

  initFrmReporte(){

    this.isLoading = true;

    this.reporteVarOperacionalDto = {
      anio: 2023,
      nomVar: '0200',
      nivel: 'localidad'
    }

    let tmpVariableToFrm: { code: string, name: string }[] = [
      { "code": "Continuidad", "name": "Continuidad" },
      { "code": "Presion", "name": "Presión" }
    ] ;

    this.reporteService.fechaprocesa().subscribe(
      (datafecha: any) => {
      
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

    let tmpNivelToFrm: { code: string, name: string }[] = [
      { "code": "Localidad", "name": "Localidad" },
      { "code": "Sector", "name": "Sector" }
    ] ;

    this.optionsAnio     = tmpAnioToFrm;
    this.optionsNivel    = tmpNivelToFrm;
    this.optionsVariable = tmpVariableToFrm;

  }

  validarReporte() {
    let result = true;
    this.messageErrorVariable = null;
    this.messageErrorAnio = null;
    this.messageErrorNivel = null;

    if (this.form.value.variable == null) {
      this.messageErrorVariable = '* Campo obligatorio.';
      result = false;
    }
    if (this.form.value.anio == null) {
      this.messageErrorAnio = '* Campo obligatorio.';
      result = false;
    }
    if (this.form.value.nivel == null) {
      this.messageErrorNivel = '* Campo obligatorio.';
      result = false;
    }

    return result;
  }

  obtenerReporte(){
    
    this.showResultadosReporte = false;

    if (!this.validarReporte()) return;

    this.resultadosReporteLocalidadPresion     = [];
    this.resultadosReporteLocalidadContinuidad = [];
    this.resultadosReporteSectorPresion        = [];
    this.resultadosReporteSectorContinuidad    = [];

    clearAllTableRepVarOperacional();

    if (
      this.form.value.anio != null &&
      this.form.value.variable != null &&
      this.form.value.nivel != null
    )
    {

      this.isLoading = true;

      this.variableCode = this.form.value.variable;
      this.anioCode     = this.form.value.anio;
      this.nivelCode    = this.form.value.nivel;

      this.reporteVarOperacionalDto.anio   = this.anioCode;
      this.reporteVarOperacionalDto.nivel  = this.nivelCode;
      this.reporteVarOperacionalDto.nomVar = this.variableCode;

      this.reporteService.variablesoperacional(this.reporteVarOperacionalDto).subscribe((data:any)=>{

        if(data.success){
          if(data.total == 0){
            this.resultadosReporteLocalidadPresion     = [];
            this.resultadosReporteSectorPresion        = [];
            this.resultadosReporteLocalidadContinuidad = [];
            this.resultadosReporteSectorContinuidad    = [];
          }
          else{
            
            this.showResultadosReporte = true;

            if(this.nivelCode == "Localidad"){
              
              if(this.variableCode == "Presion"){
                
                this.resultadosReporteLocalidadPresion = data.items;

                createTableLocalidadPresion();

              }
              else{

                this.resultadosReporteLocalidadContinuidad = data.items;

                createTableLocalidadContinuidad();

              }
            
            }
            else{

              if(this.variableCode == "Presion"){
                
                this.resultadosReporteSectorPresion = data.items;

                createTableSector();

              }
              else{

                this.resultadosReporteSectorContinuidad = data.items;

                createTableSector();

              }

              attachEventsToTabInRepVarOperacional();
            }

          }

          this.isLoading = false;
        }

      });

    }
  }

  exportReporte(){
    
    if (!this.validarReporte()) return;
    
    if (
      this.form.value.anio != null &&
      this.form.value.variable != null &&
      this.form.value.nivel != null
    )
    {
      this.isLoading = true;
      const currentDate = moment();
      // currentDate.format('YYYYMMDD_hh:mm:ss')

      this.reporteVarOperacionalDto.anio   = this.form.value.anio;
      this.reporteVarOperacionalDto.nomVar = this.form.value.variable;
      this.reporteVarOperacionalDto.nivel  = this.form.value.nivel;

      this.reporteService.exportvariablesoperacional(this.reporteVarOperacionalDto).subscribe(data=>{
        var fileURL = window.URL.createObjectURL(data);
        var a = document.createElement("a");
        a.href = fileURL;
        a.download = 'RVO_'+this.reporteVarOperacionalDto.nomVar+'_'+this.reporteVarOperacionalDto.anio+'_'+this.reporteVarOperacionalDto.nivel;
        a.click();
        this.isLoading = false;
      });
    }
  }

  changeVariableFromSelect = (e) => {
    this.form.controls['variable'].setValue(e);
    this.messageErrorVariable = null;
    this.showResultadosReporte = false;
  }

  changeAnioFromSelect = (e) => {
    this.form.controls['anio'].setValue(e);
    this.messageErrorAnio = null;
    this.showResultadosReporte = false;
  }

  changeNivelFromSelect = (e) => {
    this.form.controls['nivel'].setValue(e);
    this.messageErrorNivel = null;
    this.showResultadosReporte = false;
  }

  redimensionaTableVariables(){
    
    if ( $.fn.dataTable.isDataTable( '#table-sector-variables' ) ) {
      setTimeout(()=>{  
        var table = $('#table-sector-variables').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
      }, 200);
    }
  }

  redimensionaTableConexiones(){
    
    if ( $.fn.dataTable.isDataTable( '#table-sector-conexiones' ) ) {
      setTimeout(()=>{  
        var table = $('#table-sector-conexiones').DataTable(); console.log('redimensiona'); table.columns.adjust().draw();
      }, 200);
    }
  }
}
