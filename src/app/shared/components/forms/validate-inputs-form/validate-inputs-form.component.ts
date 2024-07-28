import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validate-inputs-form',
  templateUrl: './validate-inputs-form.component.html',
  styleUrls: ['./validate-inputs-form.component.css']
})
export class ValidateInputsFormComponent implements OnInit {

  @Input() form: FormGroup = new FormGroup({});
  @Input() formInput: string = '';
  @Input() labelInput: string = '';
  @Input() customLabelInput: boolean = false; //En caso de que se quiera colocar un mensaje particular
  @Input() subGroup: string = '';

  constructor() {

  }

  /**
   * Se encarga de retornar el mensaje adecuado de cada validacion
   * no cumplida en los campos de captura.
   */
  get formInputError() {

    let inputForm = this.form.get(this.subGroup)?.get(this.formInput);
    if(this.subGroup===''){
      inputForm = this.form.get(this.formInput);
    }

    if (inputForm) {
      const errors = inputForm.errors;
      for (const errorName in errors) {
        if (inputForm.hasError(errorName) &&
            (inputForm.dirty || inputForm.touched)) {

          switch (errorName) {
            case 'required':
              return this.customLabelInput ? this.labelInput : this.labelInput.concat(' es requerido.');
            case 'maxlength':
              return this.labelInput.concat(' debe tener máximo ').
              concat(errors['maxlength'].requiredLength).concat(' caracteres.');
            case 'minlength':
              return this.labelInput.concat(' debe tener mínimo ').
              concat(errors['minlength'].requiredLength).concat(' caracteres.');
            case 'pattern':
              return this.labelInput.concat(' es inválido. Debe contener entre 8 a 15 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un caracter especial.');
            case 'max':
              return this.labelInput.concat(' máximo ').concat(errors['max'].max).concat('.');
            case 'min':
              return this.labelInput.concat(' mínima ').concat(errors['min'].min).concat('.');
            case 'email':
              return this.labelInput.concat(' es inválido.');
            case 'alfabetica':
              return this.labelInput.concat(' inválido, solo permite letras.');
            case 'alfanumerico':
              return this.labelInput.concat(' inválido, solo permite letras y números.');
            /*case 'rfc':
              return this.labelInput.concat(' es inválido.');
            case 'curp':
              return this.labelInput.concat(' es inválido.');
            case 'email':
              return this.labelInput.concat(' es inválido.');
            case 'alfabetica':
              return this.labelInput.concat(' inválido, solo permite letras.');
            case 'alfanumerico':
              return this.labelInput.concat(' inválido, solo permite letras y números.');
            case 'correoExists':
              return this.labelInput.concat(' ya esta asociado a otra cuenta.');
            case 'usuarioExists':
              return this.labelInput.concat(' ya esta asociado a otra cuenta.');
            case 'descripcionExists':
              return this.labelInput.concat(' es un registro ya existente');*/
            default:
              return errors[errorName];
          }
        }
      }
      return null;
    }
  }

  ngOnInit() {}

}

