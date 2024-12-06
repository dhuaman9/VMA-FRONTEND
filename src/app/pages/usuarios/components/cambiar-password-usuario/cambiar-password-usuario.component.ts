import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {PASSWORD_REGEX} from "../../../../utils/var.constant";
import {catchError, tap} from "rxjs/operators";
import Swal from "sweetalert2";
import {EMPTY, Observable} from "rxjs";
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cambiar-password-usuario',
  templateUrl: './cambiar-password-usuario.component.html',
  styleUrls: ['./cambiar-password-usuario.component.css']
})
export class CambiarPasswordUsuarioComponent implements OnInit {
  @Input() username: string;
  @Output() cerrarModal = new EventEmitter<void>();

  form: FormGroup;
  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.form  = new FormGroup({
        username: new FormControl(this.username, Validators.required),
        nuevaPassword: new FormControl(null,[Validators.required,Validators.pattern(PASSWORD_REGEX)]),
        //repetirPassword: new FormControl(null, Validators.required)
      },
     // { validators: this.passwordMatchValidator() }
    );

  }

  cambiarPassword(): void {
    if(this.form.valid) {
      this.userService.cambiarPasswordUsuario(this.form.value)
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
    this.form.reset();
    this.cerrarModal.emit();
  }

  private onError = (error: any): Observable<never> => {
    let mensajeError = 'Ocurrió un error inesperado';
    if(error && error.error && error.error.code === 'BAD_REQUEST') {
      mensajeError = error.error.message;
    }

    Swal.fire(mensajeError, '','error');
    return EMPTY;
  }

 /* passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('nuevaPassword');
      const confirmPassword = control.get('repetirPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordDiferente: true };
      }
      return null;
    };
  }*/

  generarClaveAleatorio(): void {
    this.userService.generarClaveAleatorio()
      .subscribe(response => this.form.get('nuevaPassword').setValue(response));
  }

  copiarAlPortapapeles(): void {
    const passwordValue = this.form.get('nuevaPassword')?.value;

    if (passwordValue) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(passwordValue)
          .then(() => {
            this.messageService.add({ severity: 'success', summary: 'Copiado', detail: 'Clave copiada al portapapeles' });
          })
          .catch((error) => {
            console.error('Error al copiar al portapapeles: ', error);
          });
      } else {
        console.error('El navegador no soporta la API de portapapeles.');
      }
    } else {
      console.error('No se encontró la clave.');
    }
  }

}
