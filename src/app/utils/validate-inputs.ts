import { AbstractControl, FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { Directive, HostListener } from '@angular/core';

export class ValidateInputs {
    /**
     * Metodo para que la forma muestre el mensaje de los campos
     * que son requeridos y no fueron llenados.
     * @param formGroup - objeto que representa a la Forma
     * que contiene los campos de captura
     */
     static touchedAllFormFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
          const control = formGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsTouched({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.touchedAllFormFields(control);
          }
      });
  
  }
  }
  
  @Directive({
    selector: '[dirAlphabeticInput]'
  })
  export class AlphabeticInputDirective {
  
    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      // La expresión regular permite letras, tildes y diéresis
      inputElement.value = inputElement.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]/g, '');
    }
  }

  @Directive({
    selector: '[dirTelefonoInput]'
  })
  export class TelefonoInputDirective {
  
    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      // Permitir solo dígitos numéricos y limitar a 9 caracteres
      inputElement.value = inputElement.value.replace(/[^0-9]/g, '').slice(0, 9);
    }
  }

  @Directive({
    selector: '[dirUserNameInput]'
  })
  export class UserNameInputDirective {
  
    @HostListener('input', ['$event'])
    onInputChange(event: Event) {
      const inputElement = event.target as HTMLInputElement;
      inputElement.value = inputElement.value.replace(/[^a-zA-Z0123456789_-]/g, '');
    }
  }
  
  
  /**
  * Validación customizada para campos de correo electronico
  * integrada en las Formas Reactivas
  * @returns
  */
  export function ValidationEmail(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>  {
    const RFC_REGEXP = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  
    if(control.value){
      if(RFC_REGEXP.test(control.value)){
        return null;
      } else {
        return {email: control.value};
      }
    } else {
      return null;
    }
  }
  
  }
  
  /**
  * Validación customizada para campos alfabeticos
  * integrados en las Formas Reactivas
  * @returns
  */
  export function ValidationAlfabetica(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>  {
    const RFC_REGEXP = /^[a-zA-ZÀ-ÿ\s]*$/;
  
    if(control.value){
      if(RFC_REGEXP.test(control.value)){
        return null;
      } else {
        return {alfabetica: control.value};
      }
    } else {
      return null;
    }
  }
  
  }
  
  /**
  * Validación customizada para campos alfabeticos que no incluyen ciertos carcteres especiales
  * integrados en las Formas Reactivas
  * @returns
  */
  export function ValidationCaracteresEspeciales(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>  {
    const RFC_REGEXP = /^(?!.*(#|\$|&|%|\/|\(|\'|\.)).*/;
  
    if(control.value){
      if(RFC_REGEXP.test(control.value)){
        return null;
      } else {
        return {alfabetica: control.value};
      }
    } else {
      return null;
    }
  }
  
  }
  
  /**
  * Validación customizada para campos alfanumericos
  * integrados en las Formas Reactivas
  * @returns
  */
  export function ValidationAlfanumerico(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>  {
    const RFC_REGEXP = /^[0-9a-zA-ZÀ-ÿ\s]*$/;
  
    if(control.value){
      if(RFC_REGEXP.test(control.value)){
        return null;
      } else {
        return {alfanumerico: control.value};
      }
    } else {
      return null;
    }
  }
  
  }

  export function validateInput(formControlName: AbstractControl, validationType: string): void {
    let cleanedValue = formControlName.value.replace(/^\s+/, '');
    switch(validationType){
      case 'alfabetico':
        cleanedValue = cleanedValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]/g, '');
        break
      case 'numerico':
        cleanedValue = cleanedValue.replace(/[^0-9]/g, '');
        break;
    }
    formControlName.setValue(cleanedValue, { emitEvent: false });
  }

  export function trimSpaces(str: string): string {
    return str.trim();
  }
  
  export function cleanSpaces(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.value && typeof control.value === 'string') {
        control.setValue(trimSpaces(control.value), { emitEvent: false });
      }
    });
  }
  
  
  