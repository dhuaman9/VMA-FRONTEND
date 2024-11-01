import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {catchError, tap} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import { Router } from '@angular/router';
import { TIPO_EPS ,PASSWORD_REGEX} from 'src/app/utils/var.constant';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.component.html',
  styleUrls: ['./cambiar-password.component.css']
})
export class CambiarPasswordComponent implements OnInit {
  form: FormGroup;
  constructor(private userService: UserService, private router: Router,  private location: Location) {
    this.form  = new FormGroup({
      passwordActual: new FormControl(null, Validators.required),
      nuevaPassword: new FormControl(null,[Validators.required,Validators.pattern(PASSWORD_REGEX)]),
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
      Swal.fire('Verifique los campos ingresados.', '','info');
    }
  }

  private onSuccess = (): void => {
    Swal.fire('Se actualizó su contraseña!.', '','success');
   // this.form.reset();
    //this.router.navigate(['/inicio/vma']);
    this.location.back();
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
      const password = control.get('nuevaPassword');
      const confirmPassword = control.get('confirmarPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordDiferente: true };
      }
      return null;
    };
  }

}