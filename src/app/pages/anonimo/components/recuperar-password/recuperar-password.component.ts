import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TokenPasswordService} from "../../services/token-password.service";
import {catchError, switchMap, tap} from "rxjs/operators";
import {TokenPassword} from "../../models/token-password";
import Swal from "sweetalert2";
import {PASSWORD_REGEX} from "../../../../utils/var.constant";

@Component({
  selector: 'app-recuperar-passwor',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  form: FormGroup;
  cargando: boolean;
  token: TokenPassword;

  constructor(private activatedRoute: ActivatedRoute,
              private tokenPasswordService: TokenPasswordService,
              private router: Router) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    this.form = new FormGroup({
      nuevaPassword: new FormControl(null, [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      repetirPassword: new FormControl(null, [Validators.required, Validators.pattern(PASSWORD_REGEX)])
    },
      { validators: this.passwordIgualesValidador});
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const token = params['token'];
      console.log(token)

      if(token) {
        this.tokenPasswordService.getTokenPassword(token)
          .pipe(
            tap(this.onSuccess),
            catchError(() => Swal.fire('Ocurrió un error', 'Ocurrió un error'))
          )
          .subscribe()
      }
    });
  }

  private onSuccess = (token: TokenPassword) => {
    this.token = token;
  }

  cambiarPassword(): void {
    console.log(this.form)
    if(this.form.valid) {
      this.tokenPasswordService.recuperarPassword(this.token.token, this.form.value)
        .pipe(
          tap(() => Swal.fire('Contraseña actualizada', 'La contraseña se actualizó con éxito', 'success')),
          switchMap(() => this.router.navigate(['/login']))
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
      Swal.fire('Verifique los campos', '','info');
    }
  }

  passwordIgualesValidador(form: AbstractControl): ValidationErrors | null {
    const password = form.get('nuevaPassword')?.value;
    const confirmPassword = form.get('repetirPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}