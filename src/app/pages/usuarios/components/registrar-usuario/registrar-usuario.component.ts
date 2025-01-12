import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericCombo } from 'src/app/_model/generic-combo';
import { Role } from 'src/app/pages/usuarios/models/role';
import { User } from 'src/app/pages/usuarios/models/user';
import { UserService } from 'src/app/pages/usuarios/services/user.service';
import { ValidateInputs, validateInput } from 'src/app/utils/validate-inputs';
import { Empresa } from 'src/app/pages/empresa/models/empresa';
import { EmpresaService } from 'src/app/pages/empresa/services/empresa.service';
import {
  TIPO_SUNASS,
  TIPO_EPS,
  ROL_ADMINISTRADOR_OTI,
  ROL_ADMINISTRADOR_DF,
  ROL_REGISTRADOR,
  ROL_CONSULTOR,
  PASSWORD_REGEX,
} from 'src/app/utils/var.constant';
import { MessageService } from 'primeng/api';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
})
export class RegistrarUsuarioComponent implements OnInit {
  registroForm: FormGroup;
  valorPrefixUsuario: string = 'u_';

  isDropUsersDisable = false;
  isEdit = true;
  modalImage = '';
  modalMessage = '';
  perfiles: GenericCombo[] = [];

  isRequired: boolean = true;
  errorMessage: string | null = null;

  mostrarCampo: boolean = true; //para mostrar u ocultar campos
  mostrarCamposSunass: boolean = false; //para mostrar u ocultar campos

  usuariosSunass: { label: string; value: any }[];

  empresasLista: { label: string; value: any }[] = [];
  claveCopiada: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private router: Router,
    private empresaService: EmpresaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    //const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,#-_;])([A-Za-z\d$@$!%*?&.,#-_;]|[^ ]){8,15}$/;
    //Entre 8 a 15 caracteres, no espacios, al menos una mayúscula, una minúscula, un número y un caracter especial (@$!%*?&.,#-_;)
    this.registroForm = this.formBuilder.group({
      tipo: [TIPO_EPS, Validators.required],
      perfil: ['', Validators.required], //rol de usuario
      unidadOrganica: [''],
      nombres: ['', this.mostrarCamposSunass ? Validators.required : []],
      apellidos: ['', this.mostrarCamposSunass ? Validators.required : []],
      correo: [ '',  this.mostrarCamposSunass ? [Validators.required, Validators.email] : [], ],
      selEmpresa: ['', Validators.required],
      usuario: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      telefono: [ '', this.mostrarCamposSunass ? [Validators.required, Validators.minLength(9)] : [], ],
      estado: [true],
    });

    this.onTipoUsuarioChange();
    this.cargarListaEmpresas();
  }

  onUserChange(event: any) {
    const selectedUser = event.value as User;

    if (selectedUser) {
      this.registroForm.patchValue(selectedUser);
    } else {
      // Clear form fields when no user is selected
      this.registroForm.patchValue({
        unidadOrganica: '',
        nombres: '',
        apellidos: '',
        correo: '',
      });
    }
  }

  onTipoUsuarioChange(): void {
    const currentTipo = this.registroForm.get('tipo').value;
    this.registroForm.reset();
    this.registroForm.patchValue({ tipo: currentTipo });
    this.setEnableDisableIputs();

    if (this.registroForm.get('tipo').value === TIPO_SUNASS) {
      if (!this.usuariosSunass) {
        this.cargarUsuariosLDAP();
      }
      this.perfiles = [
        { id: 1, description: ROL_ADMINISTRADOR_OTI },
        { id: 2, description: ROL_ADMINISTRADOR_DF },
        { id: 4, description: ROL_CONSULTOR },
      ];
      this.isRequired = false;
    } else if (this.registroForm.get('tipo').value === TIPO_EPS) {
      this.isRequired = true;
      this.perfiles = [
        { id: 3, description: ROL_REGISTRADOR },
        //{ id: 4, description: ROL_CONSULTOR },  //POR el momento DF, no lo necesita 
      ];
    }
  }

  guardar() {
    if (this.registroForm.valid) {
      this.registroForm.enable();
      let user = new User(this.registroForm.value);
      this.registroForm.disable();

      let role = new Role();
      role.idRole = this.registroForm.get('perfil').value;

      user.role = role;
      let empresa = new Empresa();
      empresa.idEmpresa = this.registroForm.get('selEmpresa').value;
      user.empresa = empresa;
      this.userService.create(user).subscribe(
        (responseUser) => {
          this.onAceptar();
          Swal.fire({
            icon: 'success',
            title: 'Se registró el usuario correctamente',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745', // color verde
          }).then((result) => {});
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d22c21',
          });
          this.setEnableDisableIputs();
        }
      );
    } else {
      this.setEnableDisableIputs();
      ValidateInputs.touchedAllFormFields(this.registroForm);
    }
  }

  onCancelEdit() {
    Swal.fire({
      title: '¿Está seguro que desea cancelar el registro?',
      text: 'Si acepta no se guardará ninguna información',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DF2A3D',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'SI',
      cancelButtonText: 'NO',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.onCancel();
      }
    });
  }

  onAceptar() {
    this.router.navigate(['/inicio/usuarios']);
  }

  onCancel() {
    this.router.navigate(['/inicio/usuarios']);
  }

  cargarUsuariosLDAP(): void {
    this.userService.findAllLDAP().subscribe(
      (data: User[]) => {
        this.usuariosSunass = data.map((user) => ({
          label: user.username,
          value: user,
        }));
      },
      (error) => {
        console.error('Error al obtener los usuarios del LDAP', error);
      }
    );
  }

  private setEnableDisableIputs() {
    if (this.registroForm.get('tipo').value === TIPO_SUNASS) {
      this.mostrarCampo = false; //es para   ocultar los  campo  de usuarios EPS, al dar clic en Sunass
      this.mostrarCamposSunass = true;
      this.isDropUsersDisable = false;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').disable();
      this.registroForm.get('username').disable();
      this.registroForm.get('usuario').enable();
      this.registroForm.get('tipo').enable();

      this.registroForm
        .get('selEmpresa')
        .setValidators([Validators.nullValidator]);
      this.registroForm
        .get('telefono')
        .setValidators([Validators.minLength(9)]);
      this.registroForm
        .get('password')
        .setValidators([Validators.nullValidator]);
      this.registroForm.get('usuario').setValidators([Validators.required]);

      this.registroForm.get('selEmpresa').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();
      this.registroForm.get('password').updateValueAndValidity();
      this.registroForm.get('usuario').updateValueAndValidity();
    } else if (this.registroForm.get('tipo').value === TIPO_EPS) {
      this.mostrarCampo = true;
      this.mostrarCamposSunass = false;
      this.isDropUsersDisable = true;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('usuario').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('username').enable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').enable();
      this.registroForm.get('perfil').enable();
      this.registroForm.get('selEmpresa').enable();
      //this.registroForm.get('telefono').disable();
      this.registroForm.get('tipo').enable();

      this.registroForm.get('selEmpresa').setValidators([Validators.required]);
      this.registroForm
        .get('usuario')
        .setValidators([Validators.nullValidator]);
      this.registroForm
        .get('password')
        .setValidators([
          Validators.required,
          Validators.pattern(PASSWORD_REGEX),
        ]);

      this.registroForm.get('usuario').updateValueAndValidity();
      this.registroForm.get('selEmpresa').updateValueAndValidity();
      this.registroForm.get('password').updateValueAndValidity();

      const usernameValue = this.registroForm.get('username').value || '';
      if (!usernameValue.startsWith('u_')) {
        this.registroForm
          .get('username')
          .setValue('u_' + usernameValue.replace(/^u_/, ''));
      }
    }
  }

  isFieldRequired(field: string): boolean {
    const control = this.registroForm.get(field);
    if (!control) {
      return false;
    }
    const validator = control.validator
      ? control.validator({} as AbstractControl)
      : null;
    return !!(validator && validator.required);
  }

  cargarListaEmpresas(): void {
    this.empresaService.findAll().subscribe(
      (data: any[]) => {
        this.empresasLista = data.map((emp) => ({
          label: emp.nombre,
          value: emp.idEmpresa,
        }));
      },
      (error) => {
        console.error('Error al obtener la lista de las empresas', error);
      }
    );
  }

  validateInputForm(formControlName: string, validationType: string): void {
    const control = this.registroForm.get(formControlName);
    if (control) {
      validateInput(control, validationType);
    }
  }

  generarClaveAleatorio(): void {
    this.userService
      .generarClaveAleatorio()
      .subscribe((response) =>
        this.registroForm.get('password').setValue(response)
      );
  }

  enforcePrefix(event?: KeyboardEvent) {
    // Verifica si se está presionando Delete o Backspace
    if (event && (event.key === 'Delete' || event.key === 'Backspace')) {
      // Si el campo solo contiene el prefijo "u_", evita borrar o modificarlo
      if (this.valorPrefixUsuario === 'u_') {
        event.preventDefault(); // Evita borrar el prefijo
        return;
      }
    }

    // Garantiza que el valor siempre comience con "U_"
    if (!this.valorPrefixUsuario.startsWith('u_')) {
      this.valorPrefixUsuario =
        'u_' + this.valorPrefixUsuario.replace(/^u_/, '');
    }
  }

  copiarAlPortapapeles(): void {
    const passwordValue = this.registroForm.get('password')?.value;

    if (passwordValue) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(passwordValue)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Copiado',
              detail: 'Clave copiada al portapapeles',
            });
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
