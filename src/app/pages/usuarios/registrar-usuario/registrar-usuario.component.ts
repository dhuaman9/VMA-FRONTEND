import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GenericCombo } from 'src/app/_dto/generic-combo';
import { Role } from 'src/app/_model/role';
import { User } from 'src/app/_model/user';
import { UserService } from 'src/app/_service/user.service';
import { ValidateInputs } from 'src/app/utils/validate-inputs';
import { Empresa } from 'src/app/_model/empresa';
import { EmpresaService } from 'src/app/_service/empresa.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {

  registroForm: FormGroup;
  displayModaAdvice = false;
  isDropUsersDisable = false
  isEdit = true;
  modalImage ='';
  modalMessage = '';
  perfiles: GenericCombo[] =[];
  continue : boolean  = true;  // en caso aparesca algun error de validacion no siga con los dems metodos.

  errorMessage: string | null = null;

  mostrarCampo: boolean = true; 

  usuariosSunass: {label: string, value: any}[] = [];

  ListEmpresa: Empresa[];
  empresasLista: {label: string, value: any}[] = [];
  //usuariosMap: Map<number, User> = new Map();//se usara en el ngOnInit

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal,
    private userService : UserService,
    private router: Router,  private empresaService : EmpresaService
  ) {

   }

  ngOnInit(): void {

    this.cargarUsuariosLDAP();

    this.registroForm = this.formBuilder.group({
      tipo: ['EPS', Validators.required],
      perfil: ['', Validators.required],
      unidadOrganica: [''],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      //eps: ['', Validators.required],
      selEmpresa : ['', Validators.required],
      usuario: [''],
      username: [''],
      password: ['', Validators.required],
      telefono: ['', Validators.required],
      estado: [true]
    });
    
    this.onTipoUsuarioChange();
    this.cargarListaEmpresas();

    //para obtener los demas datos del usuario, al seleccionar un usuario del combobox.



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

  onTipoUsuarioChange(): void {

    const currentTipo = this.registroForm.get('tipo').value;
    this.registroForm.reset();
    this.registroForm.patchValue({'tipo':currentTipo});
    this.setEnableDisableIputs();
    
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
  }

  guardar() {

   // this.registroForm.enable(); habilita todos los campos del form
    
    if(this.registroForm.valid) {
      console.log("this.registroForm.value",this.registroForm.value);
      let user = new User(this.registroForm.value);
      let role = new Role();
      role.idRole = this.registroForm.get("perfil").value;
      user.role = role;

      let empresa = new Empresa();

      empresa.idEmpresa = this.registroForm.get("selEmpresa").value;
      user.empresa = empresa;
      
      this.userService.create(user).subscribe(responseUser => {
        Swal.fire({
          icon: "success",
          title: 'Se registró el usuario correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // color verde
          timer: 4000
        });
        this.onAceptar();
      },
       error => {  
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
       }
     );
    } else {
      this.setEnableDisableIputs();
      ValidateInputs.touchedAllFormFields(this.registroForm);
    }
  }

  onCancelEdit() {
   /* this.displayModaAdvice = true;
    this.isEdit = false;
    this.modalImage = './assets/images/cancel-icon.png';
    this.modalMessage = 'Registro cancelado';*/
    this.onAceptar();
  }

  onAceptar(){
    // this.userService.page(1,10).subscribe();
    //this.userService.findAll().subscribe();
    this.router.navigate(['/inicio/usuarios']).then(() => {
      // Aquí puedes forzar la recarga de la lista de usuarios si es necesario
     window.location.reload();
    });
  //  this.router.navigate(['/inicio/usuarios']);
    
  }

  onCancel() {
    this.router.navigate(['/inicio/usuarios']);
  }
 //console.error('Error al obtener los usuarios del LDAP', error);
  cargarUsuariosLDAP(): void {
    this.userService.findAllLDAP().subscribe(
      
      (data: User[]) => {        
        this.usuariosSunass = data.map(user => ({
          label: user.username,
          //value: user.id
          value: user
        }));
        /*data.forEach(user => {
          this.usuariosMap.set(user.id, user);
        });*/
      },
      (error) => {
        console.error('Error al obtener los usuarios del LDAP', error);
      }
    );
  }

  private setEnableDisableIputs(){
    if(this.registroForm.get('tipo').value === 'SUNASS'){
      this.mostrarCampo =false; //por ejemplo se va ocultar el campo EPS
      this.isDropUsersDisable = false;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').disable();
      this.registroForm.get('usuario').enable();

     // this.registroForm.get('eps').setValidators([Validators.nullValidator]);
      this.registroForm.get('selEmpresa').setValidators([Validators.nullValidator]);
      this.registroForm.get('telefono').setValidators([Validators.nullValidator]);
      this.registroForm.get('password').setValidators([Validators.nullValidator]);

      //this.registroForm.get('eps').updateValueAndValidity();
      this.registroForm.get('selEmpresa').updateValueAndValidity();
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
      //this.registroForm.get('eps').enable();
      this.registroForm.get('password').enable();
     // this.registroForm.get('eps').setValidators([Validators.required]);
      this.registroForm.get('selEmpresa').setValidators([Validators.required])
      this.registroForm.get('telefono').setValidators([Validators.required]);
      //this.registroForm.get('eps').updateValueAndValidity();
      this.registroForm.get('selEmpresa').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();
    }
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
@Component({
  selector: 'app-modal-component',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Mensaje</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" (click)="activeModal.close('Aceptar')">Aceptar</button>
    </div>
  `
})
export class ModalComponent {
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) {}
}
