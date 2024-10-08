import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericCombo } from 'src/app/_dto/generic-combo';
import { Role } from 'src/app/_model/role';
import { User } from 'src/app/_model/user';
import { UserService } from 'src/app/_service/user.service';
import { ValidateInputs, validateInput } from 'src/app/utils/validate-inputs';
import { EmpresaService } from 'src/app/_service/empresa.service';
import { Empresa } from 'src/app/_model/empresa';
import Swal from 'sweetalert2'


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

    
  usuariosSunass: {label: string, value: any}[] = [];
  empresasLista: {label: string, value: any}[] = [];

  constructor(private formBuilder: FormBuilder,
    private userService : UserService,
    private router: Router,
    private routeAct: ActivatedRoute,
    private empresaService : EmpresaService
  ) { }

  ngOnInit(): void {
    this.cargarUsuariosLDAP();
    this.cargarListaEmpresas();
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,#-_;])([A-Za-z\d$@$!%*?&.,#-_;]|[^ ]){8,15}$/;
    this.registroForm = this.formBuilder.group({
      id: ['', Validators.required],
      tipo: ['EPS', Validators.required],
      perfil: ['', Validators.required],
      unidadOrganica: [''],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      usuario: [''],
      username: [''],
      password: ['',Validators.pattern(regex)],
      telefono: ['', [Validators.required, Validators.minLength(9)]],
      estado: [true, Validators.required],
      selEmpresa : ['', Validators.required],
    });

    this.routeAct.params.subscribe(params => {
      const idUser = +params['id'];
      this.getDataUser(idUser);
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
    console.log('idUser:', idUser);
    this.userService.findById(idUser).subscribe(responseDataUser => {
      console.log("respons(eDataUser=>", responseDataUser);
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
    console.log('Datos de usuario:', userData);

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
      estado: userData.estado
    });

    console.log('Valor del formulario:', this.registroForm.value);
  }

  onTipoUsuarioChange(): void {

  
    if(this.registroForm.get('tipo').value === 'SUNASS'){
      this.perfiles = [
        {id:1, description:'Administrador OTI'}, 
        {id:2, description:'Administrador DAP'},
        {id:3, description:'Registrador'},
        {id:4, description:'Consultor'}];

    } else if(this.registroForm.get('tipo').value === 'EPS') {
      this.perfiles = [
        {id:3, description:'Registrador'},
        {id:4, description:'Consultor'}];

    }
    this.setEnableDisableIputs();
  }

  onUserChange(event: any) {
    console.log('event cmb usersldap', event);
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
    this.userService.findAllLDAP().subscribe(
      
      (data: User[]) => {        
        this.usuariosSunass = data.map(user => ({
          label: user.username,
          value: user.username
        }));
      },
      (error) => {
        console.error('Error, no se obtuvo los usuarios del LDAP', error);
      }
    );
  }

  onGuardar() {
 
    if(this.registroForm.valid) {
      console.log("this.registroForm.value",this.registroForm.value);
      let user = new User(this.registroForm.value);
      let role = new Role();

      role.idRole = this.registroForm.get("perfil").value;
      user.role = role;
      let empresa = new Empresa();
      empresa.idEmpresa = this.registroForm.get("selEmpresa").value;
      user.empresa = empresa;
      
      this.userService.update(user).subscribe(responseUser => {
        Swal.fire({
          icon: "success",
          title: 'Se actualizó el usuario correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // color verde
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.onAceptar(); // se redirige al listado de usuarios
          }
        });
      },  error => {  
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
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
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.onCancel();
      }
    });
  }

  onAceptar(){
   // this.userService.page(1,10).subscribe();// dhr ?
   // this.userService.findAll().subscribe();
    this.router.navigate(['/inicio/usuarios']).then(() => {
      // Aquí puedes forzar la recarga de la lista de usuarios , x ahora no recomendable
      window.location.reload();
    });
    //this.router.navigate(['/inicio/usuarios']);
    
  }

  onCancel() {
    this.router.navigate(['/inicio/usuarios']);
  }

  validateAlfabetico(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
    this.val = inputElement.value;
  }
  //edit

  private setEnableDisableIputs(){
    console.log('this.registroForm.get(tipo).value', this.registroForm.get('tipo').value);
    if(this.registroForm.get('tipo').value === 'SUNASS'){
      this.mostrarCampo =false; //por ejemplo se va ocultar el campo EPS
      this.isDropUsersDisable = false;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').disable();
      this.registroForm.get('usuario').enable();

      this.registroForm.get('usuario').setValidators([Validators.required]);
      this.registroForm.get('perfil').setValidators([Validators.required]);
      this.registroForm.get('telefono').setValidators([Validators.nullValidator]);

      this.registroForm.get('usuario').updateValueAndValidity();
      this.registroForm.get('perfil').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();

    } else if(this.registroForm.get('tipo').value === 'EPS') {
      this.mostrarCampo =true; 
      this.isDropUsersDisable = true;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('usuario').disable();
      this.registroForm.get('nombres').enable();
      this.registroForm.get('apellidos').enable();
      this.registroForm.get('correo').enable();
      this.registroForm.get('password').enable();

      this.registroForm.get('usuario').setValidators([Validators.required]);
      this.registroForm.get('username').setValidators([Validators.required]);
      this.registroForm.get('telefono').setValidators([Validators.required, Validators.minLength(9)]);

      this.registroForm.get('usuario').updateValueAndValidity();
      this.registroForm.get('username').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();

    }

    this.registroForm.get('usuario').disable();
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

}
