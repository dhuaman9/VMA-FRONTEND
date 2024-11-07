export class TokenPassword {
  constructor(public token: string,
              public completo: boolean,
              public fechaExpiracion: Date) {
  }
}
