import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericCombo } from 'src/app/_model/generic-combo';
import { Role } from 'src/app/_model/role';
import { User } from 'src/app/pages/usuarios/models/user';
import { UserService } from 'src/app/pages/usuarios/services/user.service';
import { ValidateInputs, validateInput } from 'src/app/utils/validate-inputs';
import { EmpresaService } from 'src/app/pages/empresa/services/empresa.service';
import { Empresa } from 'src/app/pages/empresa/models/empresa';
import { TIPO_SUNASS, TIPO_EPS , ROL_ADMINISTRADOR_OTI,ROL_ADMINISTRADOR_DF,
  ROL_REGISTRADOR,ROL_CONSULTOR,PASSWORD_REGEX} from 'src/app/utils/var.constant';
import Swal from 'sweetalert2';
import {tap} from "rxjs/operators";


@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  val: string;
  registroForm: FormGroup;
  displayModaAdvice = false;
  isEdit = true;
  modalImage ='';
  modalMessage = '';
  isDropUsersDisable = false;
  perfiles: GenericCombo[] = [];
  mostrarCampo: boolean = true;
  isUsuarioEPS: boolean = false;
  mostrarCamposSunass: boolean = false;

  usuariosSunass: {label: string, value: any}[];
  empresasLista: {label: string, value: any}[] = [];

  constructor(private formBuilder: FormBuilder,
    private userService : UserService,
    private router: Router,
    private routeAct: ActivatedRoute,
    private empresaService : EmpresaService
  ) { }

  ngOnInit(): void {
    //this.cargarUsuariosLDAP();
    this.cargarListaEmpresas();
    //const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,#-_;])([A-Za-z\d$@$!%*?&.,#-_;]|[^ ]){8,15}$/;
    this.registroForm = this.formBuilder.group({
      id: ['', Validators.required],
      tipo: ['EPS', Validators.required],
      perfil: ['', Validators.required],
      unidadOrganica: [''],
      nombres: ['', this.mostrarCamposSunass ? Validators.required : []],
      apellidos: ['', this.mostrarCamposSunass ? Validators.required : []],
      correo: ['', this.mostrarCamposSunass ? [Validators.required, Validators.email]: []],
      usuario: [''],
      username: [''],
      //password: ['',Validators.pattern(PASSWORD_REGEX)], //si se desea ingresar manualmente cumpliendo el regex
      password: [''],
      telefono: ['', this.mostrarCamposSunass ? [Validators.required,Validators.minLength(9)]: []],
      estado: [true, Validators.required],
      selEmpresa : ['', Validators.required],
    });

    this.routeAct.params.subscribe(params => {
      const idUser = +params['id'];
      this.getDataUser(idUser);
    });

  }

  actualizarTokenPassword(): void {
    Swal.fire({
      icon: "question",
      title: '¿Desea enviar correo para restablecer contraseña?',
      showConfirmButton: true,
      confirmButtonText: 'Sí',
      confirmButtonColor: '#28a745',
      showCancelButton: true,
      cancelButtonText: 'No',
      cancelButtonColor: '#e91224',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.actualizarTokenPassword(this.registroForm.get('id').value)
          .pipe(
            tap(() =>  Swal.fire('Se envio el correo con éxito','','success'))
          )
          .subscribe();
      }
    });
  }

  isFieldRequired(field: string): boolean {
    const control = this.registroForm.get(field);
    if (!control) {
      return false;
    }
    const validator = control.validator ? control.validator({} as AbstractControl) : null;
    return !!(validator && validator.required);
  }

  getDataUser(idUser: number) {
    this.userService.findById(idUser).subscribe((responseDataUser: any) => {
      this.isUsuarioEPS = responseDataUser.tipo === 'EPS';
      this.setDataUser(responseDataUser);
      this.onTipoUsuarioChange();
    });
  }

  validateInputForm(formControlName: string, validationType: string): void {
    const control = this.registroForm.get(formControlName);
    if (control) {
      validateInput(control, validationType);
    }
  }

  setDataUser(userData: any) {

    this.registroForm.patchValue({
      id: userData.id,
      tipo: userData.tipo,
      perfil: userData.role.idRole,
      unidadOrganica: userData.unidadOrganica,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      correo: userData.correo,
      selEmpresa: userData.empresa.idEmpresa,
      usuario: userData.username,
      username: userData.username,
      telefono: userData.telefono,
      estado: userData.estado,
      //password: userData.passwordPlain  //dhr no se usaria, porque se expondria la clave
    });

  }

  onTipoUsuarioChange(): void {


    if(this.registroForm.get('tipo').value === TIPO_SUNASS){
      if(!this.usuariosSunass) {
        this.cargarUsuariosLDAP();
      }

      this.perfiles = [
        {id:1, description: ROL_ADMINISTRADOR_OTI},
        {id:2, description: ROL_ADMINISTRADOR_DF},
        {id:4, description: ROL_CONSULTOR}];

    } else if(this.registroForm.get('tipo').value === TIPO_EPS) {
      this.perfiles = [
        {id:3, description:ROL_REGISTRADOR},
        {id:4, description: ROL_CONSULTOR}];

    }
    this.setEnableDisableIputs();
  }

  onUserChange(event: any) {

    const selectedUser = event.value as User;
    if (selectedUser) {
      this.registroForm.patchValue(selectedUser);
    } else {
      // Clear form fields when no user is selected
      this.registroForm.patchValue(
        {
          unidadOrganica:'',
          nombres:'',
          apellidos:'',
          correo:''
        }
      );
    }
  }

  cargarUsuariosLDAP(): void {
    //ESTO ES DATA DE PRUEBA, SIMULACIÓN PARA USUARIOS LDAP
    this.usuariosSunass = [
      {label: 'dhuaman', value: 'dhuaman'},
      {label: 'aortega2', value: 'aortega2'},
    ]
    // this.userService.findAllLDAP().subscribe(
    //
    //   (data: User[]) => {
    //     this.usuariosSunass = data.map(user => ({
    //       label: user.username,
    //       value: user.username
    //     }));
    //   },
    //   (error) => {
    //     console.error('Error, no se obtuvo los usuarios del LDAP', error);
    //   }
    // );
  }

  onGuardar() {

    if(this.registroForm.valid) {

      let user = new User(this.registroForm.value);
      let role = new Role();
      role.idRole = this.registroForm.get("perfil").value;
      user.role = role;
      let empresa = new Empresa();
      empresa.idEmpresa = this.registroForm.get("selEmpresa").value;
      user.empresa = empresa;

      this.userService.update(user).subscribe(responseUser => {
        this.onAceptar();
        Swal.fire({
          icon: "success",
          title: 'Se actualizó el usuario correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // color verde
        }).then((result) => {
         //?
        });
      },  error => {
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
          this.setEnableDisableIputs();
      });
    } else {
      this.setEnableDisableIputs();
      ValidateInputs.touchedAllFormFields(this.registroForm);
    }

  }

  onCancelEdit() {
    Swal.fire({
      title: "¿Está seguro que desea cancelar el registro?",
      text: "Si acepta no se guardará ninguna información",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2A3D",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "SI",
      cancelButtonText: "NO",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.onCancel();
      }
    });
  }

  onAceptar(){

    this.router.navigate(['/inicio/usuarios']);

  }

  onCancel() {
    this.router.navigate(['/inicio/usuarios']);
  }

  validateAlfabetico(event: Event) {   // dhr: se usa ?
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
    this.val = inputElement.value;
  }


  private setEnableDisableIputs(){

    if(this.registroForm.get('tipo').value === TIPO_SUNASS){
      this.mostrarCampo =false; //por ejemplo se va ocultar el campo EPS
      this.mostrarCamposSunass = true;
      this.isDropUsersDisable = false;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').disable();
      this.registroForm.get('usuario').enable();
      this.registroForm.get('username').disable();

      this.registroForm.get('usuario').setValidators([Validators.required]);
      this.registroForm.get('perfil').setValidators([Validators.required]);
      this.registroForm.get('telefono').setValidators([Validators.nullValidator]);

     // this.registroForm.get('username').updateValueAndValidity();
      this.registroForm.get('usuario').updateValueAndValidity();
      this.registroForm.get('perfil').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();

    } else if(this.registroForm.get('tipo').value === TIPO_EPS) {
      this.mostrarCampo =true;
      this.isDropUsersDisable = true;
      this.mostrarCamposSunass = false;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('usuario').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').enable();

      this.registroForm.get('perfil').enable();
      this.registroForm.get('selEmpresa').enable();
      this.registroForm.get('telefono').disable();
      this.registroForm.get('tipo').enable();

      this.registroForm.get('usuario').setValidators([Validators.required]);
      this.registroForm.get('username').setValidators([Validators.required]);

      this.registroForm.get('usuario').updateValueAndValidity();
      this.registroForm.get('username').updateValueAndValidity();

    }

    this.registroForm.get('tipo').disable();
  }

  cargarListaEmpresas(): void {
    this.empresaService.findAll().subscribe(
      (data: any[]) => {
        this.empresasLista = data.map(emp => ({
          label: emp.nombre,
          value: emp.idEmpresa
        }));
      },
      (error) => {
        console.error('Error al obtener la lista de las empresas', error);
      }
    );
  }

  generarClaveAleatorio(): void {
    this.userService.generarClaveAleatorio()
      .subscribe(response => this.registroForm.get('password').setValue(response));
  }



}
