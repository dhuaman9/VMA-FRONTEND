import {RegistroVMA} from "./models/registroVMA";
import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';


export const isVmaVigente = (vma: RegistroVMA): boolean =>  {

  if(!vma.fichaRegistro.fechaInicio || !vma.fichaRegistro.fechaFin) return false;

  const fechaInicio = parseDate(vma.fichaRegistro.fechaInicio);
  const fechaFin = parseDate(vma.fichaRegistro.fechaFin);
  const fechaAhora = new Date();
  fechaAhora.setHours(0, 0, 0, 0);

  return fechaAhora >= fechaInicio && fechaAhora <= fechaFin;
}

export const parseDate = (date: string): Date => {
  const [day, month, year] = date.split('/').map(Number);
  return new Date(year, month - 1, day);
}


export function validarAcumuladoMayorOIgualParcial(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const alternativas = control.get('alternativas') as FormArray;

    if (!alternativas || alternativas.length === 0) {
      return null; // Sin alternativas, no validamos
    }

    let acumuladoValue: number | undefined;
    let error = false;

    alternativas.controls.forEach((alternativa) => {
      const nombreCampo = alternativa.get('nombreCampo')?.value;
      const respuesta = alternativa.get('respuesta')?.value;

      if (nombreCampo?.toLowerCase() === 'acumulado') {
        acumuladoValue = respuesta; // Guardamos el valor de acumulado
      }

      // Validamos los campos que comienzan con "Parcial"
      if (nombreCampo?.toLowerCase().startsWith('parcial') && acumuladoValue !== undefined) {
        if (respuesta !== undefined && acumuladoValue < respuesta) {
          error = true; // Si acumulado < parcial, activamos el error
        }
      }
    });

    return error ? { acumuladoMenorQueParcial: true } : null;
  };
}