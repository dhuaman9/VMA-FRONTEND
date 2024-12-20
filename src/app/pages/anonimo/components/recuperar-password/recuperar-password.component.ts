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
  tokenExpirado: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private tokenPasswordService: TokenPasswordService,
              private router: Router) {
    this.form = new FormGroup({
      nuevaPassword: new FormControl(null, [Validators.required, Validators.pattern(PASSWORD_REGEX)]),
      repetirPassword: new FormControl(null, [Validators.required, Validators.pattern(PASSWORD_REGEX)])
    },
      { validators: this.passwordIgualesValidador});
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const token = params['token'];

      if(token) {
        this.tokenPasswordService.getTokenPassword(token)
          .pipe(
            tap(this.onSuccess),
            catchError(() => Swal.fire('Ocurrió un error', 'La direccion URL es incorrecta.'))
          )
          .subscribe()
      }
    });
  }

  private onSuccess = (token: TokenPassword): void => {
    this.token = token;
    this.tokenExpirado = new Date() > new Date(token.fechaExpiracion);
    //console.log(new Date(token.fechaExpiracion) > new Date());
  }

  cambiarPassword(): void {
    if (this.form.valid) {
      this.tokenPasswordService
        .recuperarPassword(this.token.token, this.form.value)
        .pipe(
          tap(() =>
            Swal.fire({
              title: 'Contraseña actualizada',
              text: 'La contraseña se actualizó con éxito',
              icon: 'success',
              confirmButtonText: 'Aceptar', // Texto personalizado del botón
            })
          ),
          switchMap(() => this.router.navigate(['/login']))
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
      Swal.fire({
        title: 'Verifique los campos',
        text: '',
        icon: 'info',
        confirmButtonText: 'Aceptar', // Texto personalizado del botón
      });
    }
  }

  passwordIgualesValidador(form: AbstractControl): ValidationErrors | null {
    const password = form.get('nuevaPassword')?.value;
    const confirmPassword = form.get('repetirPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
