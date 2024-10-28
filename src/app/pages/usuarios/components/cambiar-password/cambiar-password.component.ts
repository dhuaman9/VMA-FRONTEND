import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {catchError, tap} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {
  form: FormGroup;
  constructor(private userService: UserService) {
    this.form  = new FormGroup({
      passwordActual: new FormControl(null, Validators.required),
      nuevaPassword: new FormControl(null,Validators.required),
      confirmarPassword: new FormControl(null, Validators.required)
    },
      { validators: this.passwordMatchValidator() }
    );
  }

  ngOnInit(): void {
  }

  cambiarPassword(): void {
    if(this.form.valid) {
      this.userService.cambiarPassword(this.form.value)
        .pipe(
          tap(this.onSuccess),
          catchError(this.onError)
        )
        .subscribe();
    } else {
      Swal.fire('Campos inválidos', '','info');
    }
  }

  private onSuccess = (): void => {
    Swal.fire('Contraseña actualizada', '','success');
    this.form.reset();
  }

  private onError = (error: any): Observable<never> => {
    let mensajeError = 'Ocurrió un error inesperado';
    if(error && error.error && error.error.code === 'BAD_REQUEST') {
      mensajeError = error.error.message;
    }

    Swal.fire(mensajeError, '','error');
    return EMPTY;
}

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('passwordNuevo');
      const confirmPassword = control.get('passwordRepetir');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordDiferente: true };
      }
      return null;
    };
  }

}
