import { Component, ElementRef, Input, OnInit, ViewChild  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { GenericCombo } from 'src/app/_dto/generic-combo';
import { Role } from 'src/app/_model/role';
import { User } from 'src/app/pages/usuarios/models/user';
import { UserService } from 'src/app/pages/usuarios/services/user.service';
import { ValidateInputs, validateInput } from 'src/app/utils/validate-inputs';
import { Empresa } from 'src/app/pages/empresa/models/empresa';
import { EmpresaService } from 'src/app/pages/empresa/services/empresa.service';
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
  @ViewChild('perfil') perfilInput: ElementRef<HTMLInputElement>;
  isRequired: boolean = true;
  errorMessage: string | null = null;

  mostrarCampo: boolean = true; 

  usuariosSunass: {label: string, value: any}[] = [];

  ListEmpresa: Empresa[];
  empresasLista: {label: string, value: any}[] = [];

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal,
    private userService : UserService,
    private router: Router,  private empresaService : EmpresaService
  ) {

   }

  ngOnInit(): void {

    
    this.cargarUsuariosLDAP();
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,#-_;])([A-Za-z\d$@$!%*?&.,#-_;]|[^ ]){8,15}$/;
    //Entre 8 a 15 caracteres, no espacios, al menos una mayúscula, una minúscula, un número y un caracter especial (@$!%*?&.,#-_;)
    this.registroForm = this.formBuilder.group({
      tipo: ['EPS', Validators.required],
      perfil: ['', Validators.required],
      unidadOrganica: [''],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      selEmpresa : ['', Validators.required],
      usuario: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required,Validators.pattern(regex)]],
      telefono: ['', [Validators.required,Validators.minLength(9)]],
      estado: [true]
    });
    
    this.onTipoUsuarioChange();
    this.cargarListaEmpresas();

    
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
        this.isRequired = false;
    } else if(this.registroForm.get('tipo').value === 'EPS') {
      this.isRequired = true;
      this.perfiles = [
        {id:3, description:'Registrador'},
        {id:4, description:'Consultor'}];

    }
  }

  guardar() {

    if(this.registroForm.valid) {
      console.log("this.registroForm.value",this.registroForm.value);
      this.registroForm.enable();
      let user = new User(this.registroForm.value);
      this.registroForm.disable();
      let role = new Role();
      role.idRole = this.registroForm.get("perfil").value;
      user.role = role;

      let empresa = new Empresa();

      empresa.idEmpresa = this.registroForm.get("selEmpresa").value;
      user.empresa = empresa;
      console.log(user);
      this.userService.create(user).subscribe(responseUser => {
        Swal.fire({
          icon: "success",
          title: 'Se registró el usuario correctamente',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // color verde
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.onAceptar(); // se redirige al listado de usuarios
          }
        });
        
      },
       error => {  
          Swal.fire({
            title: 'Error',
            text: error,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d22c21'
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
   
    this.router.navigate(['/inicio/usuarios']).then(() => {
      // Aquí puedes forzar la recarga de la lista , no recomendable x ahora.
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
          value: user
        }));
  
      },
      (error) => {
        console.error('Error al obtener los usuarios del LDAP', error);
      }
    );
  }

  private setEnableDisableIputs(){
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,#-_;])([A-Za-z\d$@$!%*?&.,#-_;]|[^ ]){8,15}$/;
    if(this.registroForm.get('tipo').value === 'SUNASS'){
      this.mostrarCampo =false; //por ejemplo se va ocultar el campo EPS
      this.isDropUsersDisable = false;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('nombres').disable();
      this.registroForm.get('apellidos').disable();
      this.registroForm.get('correo').disable();
      this.registroForm.get('password').disable();
      this.registroForm.get('username').disable();
      this.registroForm.get('usuario').enable();

      this.registroForm.get('selEmpresa').setValidators([Validators.nullValidator]);
      this.registroForm.get('telefono').setValidators([Validators.minLength(9)]);
      this.registroForm.get('password').setValidators([Validators.nullValidator]);
      this.registroForm.get('usuario').setValidators([Validators.required]);

      this.registroForm.get('selEmpresa').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();
      this.registroForm.get('password').updateValueAndValidity();
      this.registroForm.get('usuario').updateValueAndValidity();

    } else if(this.registroForm.get('tipo').value === 'EPS') {
      this.mostrarCampo =true; 
      this.isDropUsersDisable = true;
      this.registroForm.get('unidadOrganica').disable();
      this.registroForm.get('usuario').disable();
      this.registroForm.get('nombres').enable();
      this.registroForm.get('apellidos').enable();
      this.registroForm.get('username').enable();
      this.registroForm.get('correo').enable();
      this.registroForm.get('password').enable();

      this.registroForm.get('selEmpresa').setValidators([Validators.required]);
      this.registroForm.get('telefono').setValidators([Validators.required,Validators.minLength(9)]);
      this.registroForm.get('usuario').setValidators([Validators.nullValidator]);
      this.registroForm.get('password').setValidators([Validators.required,Validators.pattern(regex)]);

      this.registroForm.get('usuario').updateValueAndValidity();
      this.registroForm.get('selEmpresa').updateValueAndValidity();
      this.registroForm.get('telefono').updateValueAndValidity();
      this.registroForm.get('password').updateValueAndValidity();
    }
  }

  isFieldRequired(field: string): boolean {
    const control = this.registroForm.get(field);
    if (!control) {
      return false;
    }
    const validator = control.validator ? control.validator({} as AbstractControl) : null;
    return !!(validator && validator.required);
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

  validateInputForm(formControlName: string, validationType: string): void {
    const control = this.registroForm.get(formControlName);
    if (control) {
      validateInput(control, validationType);
    }
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
