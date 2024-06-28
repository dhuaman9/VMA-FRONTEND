import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericCombo } from 'src/app/_dto/generic-combo';
import { Role } from 'src/app/_model/role';
import { User } from 'src/app/_model/user';
import { UserService } from 'src/app/_service/user.service';
import { ValidateInputs } from 'src/app/utils/validate-inputs';
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
    
    this.registroForm = this.formBuilder.group({
      id: ['', Validators.required],
      tipo: ['EPS', Validators.required],
      perfil: ['', Validators.required],
      unidadOrganica: [''],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
     // eps: ['', Validators.required],
      usuario: [''],
      username: [''],
      password: [''],
      telefono: ['', Validators.required],
      estado: [true, Validators.required],
      selEmpresa : ['', Validators.required],
    });

    this.routeAct.params.subscribe(params => {
      const idUser = +params['id'];
      this.getDataUser(idUser);
    });

  }

  getDataUser(idUser: number) {
    console.log('idUser:', idUser);
    this.userService.findById(idUser).subscribe(responseDataUser => {
      console.log("respons(eDataUser=>", responseDataUser);
      this.setDataUser(responseDataUser);
      this.onTipoUsuarioChange();
    });
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
      //eps: userData.eps,
      selEmpresa: userData.empresa.idEmpresa,
      usuario: userData.username,
      username: userData.username,
      //password: '',
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
          correo:'',
         // telefono:''
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
    // Lógica para guardar el usuario
   // this.registroForm.enable();

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
          timer: 4000
        });
        this.onAceptar();
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
    /*this.displayModaAdvice = true;
    this.isEdit = false;
    this.modalImage = './assets/images/cancel-icon.png';
    this.modalMessage = 'Registro cancelado';*/
    this.onAceptar();
  }

  onAceptar(){
   // this.userService.page(1,10).subscribe();// dhr ?
   // this.userService.findAll().subscribe();
    this.router.navigate(['/inicio/usuarios']).then(() => {
      // Aquí puedes forzar la recarga de la lista de usuarios si es necesario
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

     // this.registroForm.get('eps').setValidators([Validators.nullValidator]);  //? dhr
      this.registroForm.get('telefono').setValidators([Validators.nullValidator]);
      this.registroForm.get('password').setValidators([Validators.nullValidator]);

      //this.registroForm.get('eps').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();
      this.registroForm.get('password').updateValueAndValidity();

    } else if(this.registroForm.get('tipo').value === 'EPS') {
      this.mostrarCampo =true; 
      this.isDropUsersDisable = true;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('usuario').disable();
      this.registroForm.get('nombres').enable();
      this.registroForm.get('apellidos').enable();
      this.registroForm.get('correo').enable();
    //  this.registroForm.get('eps').enable();
      this.registroForm.get('password').enable();

     // this.registroForm.get('eps').setValidators([Validators.required]);
      this.registroForm.get('telefono').setValidators([Validators.required]);
     // this.registroForm.get('eps').updateValueAndValidity();
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
