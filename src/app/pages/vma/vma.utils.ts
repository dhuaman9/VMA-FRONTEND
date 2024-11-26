import {RegistroVMA} from "./models/registroVMA";

export const isVmaVigente = (vma: RegistroVMA): boolean =>  {

  console.log("vma.fichaRegistro.fechaInicio",vma.fichaRegistro.fechaInicio);
  console.log("vma.fichaRegistro.fechaFin",vma.fichaRegistro.fechaFin);

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
