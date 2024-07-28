import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FichaRegistro } from 'src/app/_model/fichaRegistro';
import { FichaRegistroService } from 'src/app/_service/ficha-registro.service';
import { ValidateInputs } from 'src/app/utils/validate-inputs';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-edit-ficha',
  templateUrl: './register-edit-ficha.component.html',
  styleUrls: ['./register-edit-ficha.component.css']
})
export class RegisterEditFichaComponent implements OnInit {

    //Objeto para validacion de Formulario
    registroForm: FormGroup;

    years: string[] = [];
    //selectedYear: number;
  
    titleHeader: string;
    isEdition: boolean =false;

    startDate: Date;
    minEndDate: Date;
    maxEndDate: Date;

    es: any;
    
    constructor(
      private ref: DynamicDialogRef,
      private config: DynamicDialogConfig,
      private fichaRegistroService : FichaRegistroService,
      private router: Router) {
  
        this.titleHeader = this.config.data.titleHeader;
        this.isEdition = false;
    }
  

  ngOnInit(): void {

    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2022; year--) {
      this.years.push(year.toString());
    }

    this.registroForm = this.initFromGroup();

    if (this.config.data.idFichaRegistro > 0) {
      this.isEdition = true;
      this.setValuesFormGroup(this.config.data.idFichaRegistro);
    }

  }

 /**
   * Funcion para el alta o edicion de una ficha
   */
 onCreateFicha() {
  console.log('this.registroForm.valid',this.registroForm.valid, this.registroForm.value);

  if(this.registroForm.valid){
    //aqui debes de convertir las fechas al formato que necesitas antes de madarlas al backend
    console.log('moment(remoteData.fechaInicio, "DD/MM/YYYY").toDate()',
      moment(this.registroForm.get('fechaInicio').value, "DD/MM/YYYY").toDate());

      const ficha = this.prepareFichaData();
  
    if(this.isEdition){
      ficha.idFichaRegistro = this.config.data.idFichaRegistro;
      this.fichaRegistroService.update(ficha).subscribe(data =>{
        this.closeDialog(true);
    
    Swal.fire({
          icon: "success",
          title: 'Se actualizó la Ficha de registro correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745',
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/inicio/ficha-registro']).then(() => {
              // Aquí puedes forzar la recarga de la lista de fichas , por el momento no recomendable
             window.location.reload();
            });
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
      this.fichaRegistroService.create(ficha).subscribe(data =>{
        this.closeDialog(true);
        Swal.fire({
          icon: "success",
          title: 'Se registró la Ficha de registro correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // color verde
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/inicio/ficha-registro']).then(() => {
             window.location.reload();
            }); // se redirige al listado de fichas
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

  private initFromGroup() {
    return new FormGroup({
      anio: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      fechaInicio: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      fechaFin: new FormControl('', {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  /** "DD/MM/YYYY
   * Funcion para la asignacion de valores en el formulario
   * de la ficha a editar
   * @param idFichaRegistro 
   */
  private setValuesFormGroup(idFichaRegistro: number) {
    this.fichaRegistroService.findById(idFichaRegistro).subscribe(remoteData => {
      this.registroForm.patchValue({
        anio: remoteData.anio,
        fechaInicio: moment(remoteData.fechaInicio, "DD/MM/YYYY").toDate(),
        fechaFin:moment(remoteData.fechaFin, "DD/MM/YYYY").toDate()
      });
    });
  }

  /**
   * Ejecuta el cierre de la ventana emergente (Dialog)
   * del alta o edicion de una ficha
   * @param isOkAction
   */
  private closeDialog(isOkAction: boolean) {
    this.ref.close(isOkAction);
  }

  onCancelAction(){
    Swal.fire({
      title: "¿Está seguro que desea cancelar el registro?",
      text: "Si acepta no se guardará ninguna información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2A3D",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "SI",
      cancelButtonText: "No",
      didOpen: (popup) => {
        const container = popup.parentElement;
        if (container) {
          container.style.zIndex = '2000';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeDialog(false);
      }
    });
    
  }

  onStartDateSelect() {
    
    this.minEndDate = this.registroForm.get('fechaInicio').value;
    const maxEndDate = new Date(this.minEndDate);
    maxEndDate.setMonth(maxEndDate.getMonth() + 6);

    // Ajustar el día del mes si es necesario
    if (maxEndDate.getDate() !== this.minEndDate.getDate()) {
      maxEndDate.setDate(0);
    }

    this.maxEndDate = maxEndDate;
  }

  isFieldRequired(field: string): boolean {
    const control = this.registroForm.get(field);
    if (!control) {
      return false;
    }
    const validator = control.validator ? control.validator({} as AbstractControl) : null;
    return !!(validator && validator.required);
  }


  private prepareFichaData(): FichaRegistro {
    const formValues = this.registroForm.value;
    const ficha: FichaRegistro = {
      ...formValues,
      fechaInicio:   moment((new Date(this.registroForm.get('fechaInicio').value))).format('DD/MM/YYYY'),
      fechaFin:    moment((new Date(this.registroForm.get('fechaFin').value))).format('DD/MM/YYYY')
    };
    return ficha;
  }

  
}
