import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute} from '@angular/router';
import moment from 'moment';
import { forkJoin } from 'rxjs';
import { ReporteVarGestionDto } from 'src/app/_dto/reporteVarGestionDto';
import { ReporteService } from 'src/app/_service/reporte.service';
import { UtilsService } from 'src/app/_service/utils.service';

declare const clearAllTableRepVarGestion: any;
declare const createTableMensual: any;
declare const createTableTrimestral: any;

@Component({
  selector: 'app-reportes-variable-gestion',
  templateUrl: './reportes-variable-gestion.component.html',
  styleUrls: ['./reportes-variable-gestion.component.css']
})
export class ReportesVariableGestionComponent implements OnInit {

  private reporteVarGestionDto  : ReporteVarGestionDto;
  isLoading = false;

  optionsVariable: any;
  optionsAnio: any;

  infoTotalOptionsVariable: any;

  inputSelectedOptionVariable: string;
  inputSelectedOptionAnio: string;

  form: FormGroup;

  messageErrorVariable: string;
  messageErrorAnio: string;

  validationForm: boolean;

  resultadosReporteMensual : any;
  resultadosReporteTrimestral : any;

  showResultadosReporte = false;

  anioLast: number = new Date().getFullYear();

  variableId;
  anioId;
  variableTipPer;

  messageFecProcesa:string = "";

  constructor(
    public route : ActivatedRoute,
    private reporteService : ReporteService,
    private utilsService : UtilsService,
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      anio: [null, []],
      variable: [null, []],
    });

    const defaultYear = this.anioLast.toString();

    this.inputSelectedOptionVariable = null;
    this.inputSelectedOptionAnio = defaultYear;

    this.changeAnioFromSelect(defaultYear);

    this.messageErrorVariable = null;
    this.messageErrorAnio = null;
  }

  ngOnInit(): void {

    this.initFrmReporte();
  }

  initFrmReporte(){

    this.isLoading = true;

    this.reporteVarGestionDto = {
      anio: 2023,
      codVar: '0200'
    }

    const listServices$ = [ 
      this.reporteService.listavariables(),
      this.reporteService.fechaprocesa()
    ];

    forkJoin(listServices$).subscribe(
      ([datalist, datafecha]: any) => {
        
        this.infoTotalOptionsVariable = datalist;

        this.optionsVariable =  datalist;

        this.optionsVariable.sort((a, b) =>
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
    this.messageErrorVariable = null;
    this.messageErrorAnio = null;

    if (this.form.value.variable == null) {
      this.messageErrorVariable = '* Campo obligatorio.';
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

    this.resultadosReporteMensual    = [];
    this.resultadosReporteTrimestral = [];

    clearAllTableRepVarGestion();

    if (
      this.form.value.anio != null &&
      this.form.value.variable != null
    )
    {
      this.isLoading = true;

      this.variableId = this.form.value.variable;
      this.anioId     = this.form.value.anio;

      this.reporteVarGestionDto.anio   = this.anioId;
      this.reporteVarGestionDto.codVar = this.variableId;

      this.variableTipPer = this.infoTotalOptionsVariable.find((it) => { return it.code == this.variableId}).periodo;
  
      this.reporteService.variablesgestion(this.reporteVarGestionDto).subscribe((data:any)=>{

        if(data.success){
          if(data.total == 0){
            this.resultadosReporteMensual = [];
            this.resultadosReporteTrimestral = [];
          }
          else{

            this.showResultadosReporte = true;

            if(this.variableTipPer == "T"){

              this.resultadosReporteTrimestral = data.items;
              createTableTrimestral();

            }
            else{

              this.resultadosReporteMensual = data.items;
              createTableMensual();

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
      this.form.value.variable != null
    )
    {
      this.isLoading = true;
      const currentDate = moment();
      // currentDate.format('YYYYMMDD_hh:mm:ss')
      

      this.reporteVarGestionDto.anio   = this.form.value.anio;
      this.reporteVarGestionDto.codVar = this.form.value.variable;

      let infoVariableGestion = this.infoTotalOptionsVariable.find((it) => { return it.code == this.form.value.variable})
      
      let nameElementFormat = this.utilsService.formatStrToExcel(infoVariableGestion.name);

      this.reporteService.exportvariablesgestion(this.reporteVarGestionDto).subscribe(data=>{
        var fileURL = window.URL.createObjectURL(data);
        var a = document.createElement("a");
        a.href = fileURL;
        a.download = 'RVG_'+nameElementFormat+'_'+this.reporteVarGestionDto.anio;
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

}
