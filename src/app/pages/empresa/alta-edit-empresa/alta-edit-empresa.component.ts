import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Empresa } from 'src/app/pages/empresa/models/empresa';
import { EmpresaService } from 'src/app/pages/empresa/services/empresa.service';
import { ValidateInputs, cleanSpaces, validateInput  } from 'src/app/utils/validate-inputs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    { label: 'PEQUEÑA', value: 'PEQUEÑA' },
    { label: 'MEDIANA', value: 'MEDIANA' },
    { label: 'GRANDE', value: 'GRANDE' },
    { label: 'SEDAPAL', value: 'SEDAPAL' }
  ];

  titleHeader: string;
  isEdition: boolean;
  
  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private empresaService : EmpresaService,
    private router: Router) {

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
    cleanSpaces(this.registroForm);
    if(this.registroForm.valid){
      const empresa = this.registroForm.value as Empresa;
      if(this.isEdition){
        empresa.idEmpresa = this.config.data.idEmpresa;
        //empresa.nombre = this.registroForm.get('nombre').value.trimEnd();
        this.empresaService.update(empresa).subscribe(data =>{
          this.closeDialog(true);
          Swal.fire({
            icon: "success",
            title: 'Se actualizó la empresa correctamente',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.onAceptar();
            }
          });
        },
        error => {  
          this.closeDialog(true);
           Swal.fire({
             title: 'Error',
             text: error,
             icon: 'error',
             confirmButtonText: 'Aceptar',
             confirmButtonColor: '#d22c21'
           });
        });
      } else {
        empresa.nombre = this.registroForm.get('nombre').value.trimEnd();
        this.empresaService.create(empresa).subscribe(data =>{
          this.closeDialog(true);
          Swal.fire({
            icon: "success",
            title: 'Se registró la empresa correctamente',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745', // color verde
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.onAceptar(); // se redirige al listado de empresas
            }
          });
        },
        error => {  
          this.closeDialog(true);
           Swal.fire({
             title: 'Error',
             text: error,
             icon: 'error',
             confirmButtonText: 'Aceptar',
             confirmButtonColor: '#d22c21'
           });
        });
      }
    } else {
      ValidateInputs.touchedAllFormFields(this.registroForm);
    }
  }

  validateInputForm(formControlName: string, validationType: string): void {
    const control = this.registroForm.get(formControlName);
    if (control) {
      validateInput(control, validationType);
    }
  }

  onAceptar(){
    // this.userService.page(1,10).subscribe();
    //this.userService.findAll().subscribe();
    this.router.navigate(['/inicio/empresa']).then(() => {
      // Aquí puedes forzar la recarga de la lista de usuarios si es necesario
     window.location.reload();
    });
  //  this.router.navigate(['/inicio/usuarios']);
    
  }

  onCancelAction(){
    this.closeDialog(false);
  }

  isFieldRequired(field: string): boolean {
    const control = this.registroForm.get(field);
    if (!control) {
      return false;
    }
    const validator = control.validator ? control.validator({} as AbstractControl) : null;
    return !!(validator && validator.required);
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
      console.log('remoteData ====>', remoteData);
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
