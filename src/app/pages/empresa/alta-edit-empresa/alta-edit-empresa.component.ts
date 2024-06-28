import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/_model/empresa';
import { EmpresaService } from 'src/app/_service/empresa.service';
import { ValidateInputs } from 'src/app/utils/validate-inputs';

@Component({
  selector: 'app-alta-edit-empresa',
  templateUrl: './alta-edit-empresa.component.html',
  styleUrls: ['./alta-edit-empresa.component.css']
})
export class AltaEditEmpresaComponent implements OnInit {

  //Objeto para validacion de Formulario
  registroForm: FormGroup;
  
  // Variables para el llenado de informacion de los
  // combos Regimen y Tipo
  regimenOptions: any[] = [
    { label: 'RAT', value: 'RAT' },
    { label: 'NO RAT', value: 'NO RAT' }
  ];
  tipoOptions: any[] = [
    { label: 'Pequeña', value: 'Pequeña' },
    { label: 'Mediana', value: 'Mediana' },
    { label: 'Grande', value: 'Grande' },
    { label: 'Sedapal', value: 'Sedapal' }
  ];

  titleHeader: string;
  isEdition: boolean;
  
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private empresaService : EmpresaService) {

      this.titleHeader = this.config.data.titleHeader;
      this.isEdition = false;
  }

  ngOnInit(): void {
    this.registroForm = this.initFromGroup();

    if(this.config.data.idEmpresa > 0){
      this.isEdition = true;
      this.setValuesFormGroup(this.config.data.idEmpresa);
    } 
  }

  /**
   * Funcion para el alta o edicion de una empresa
   */
  onCreateEmpresa() {
    console.log('this.registroForm.valid',this.registroForm.valid, this.registroForm.value);
    if(this.registroForm.valid){
      const empresa = this.registroForm.value as Empresa;
      if(this.isEdition){
        empresa.idEmpresa = this.config.data.idEmpresa;
        this.empresaService.update(empresa).subscribe(data =>{
          this.closeDialog(true);
        });
      } else {
        this.empresaService.create(empresa).subscribe(data =>{
          this.closeDialog(true);
        });
      }
    } else {
      ValidateInputs.touchedAllFormFields(this.registroForm);
    }
  }

  onCancelAction(){
    this.closeDialog(false);
  }

  /**
   * Funcion para definir propiedas y validaciones
   * iniciales del Formulario de captura
   * @returns 
   */
  private initFromGroup() {
    return new FormGroup({
      nombre: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      tipo: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      regimen: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      estado: new FormControl(true, {
        updateOn: 'change',
        validators: [Validators.nullValidator]
      }) 
    });
  }

  /**
   * Funcion para la asignacion de valores en el formulario
   * de la empresaa editar
   * @param idEmpresa 
   */
  private setValuesFormGroup(idEmpresa: number) {
    this.empresaService.findById(idEmpresa).subscribe(remoteData =>{
      console.log('remoteData====>', remoteData);
      this.registroForm.patchValue({
        nombre: remoteData.nombre,
        tipo: remoteData.tipo,
        regimen: remoteData.regimen.trim(),
        estado: remoteData.estado
      })
    });
  }

  /**
   * Ejecuta el cierre de la ventana emergente (Dialog)
   * del alta o edicion de un usuario
   * @param isOkAction
   */
  private closeDialog(isOkAction: boolean) {
    this.ref.close(isOkAction);
  }

}
