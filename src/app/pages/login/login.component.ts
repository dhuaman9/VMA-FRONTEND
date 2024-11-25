
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../_service/login.service';
import { SessionService } from 'src/app/_service/session.service';
import { INP_USUARIO, INP_CONTRASENIA, MSG_USUARIO_PASS_ERROR, ROL_ADMINISTRADOR_OTI, ROL_ADMINISTRADOR_DF, ROL_REGISTRADOR, ROL_CONSULTOR} from '../../utils/var.constant';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user : string;
  password : string;
  rptaLogin : any[];
  msjError : string = "";
  spinnerLogin : boolean = false;
  isPasswordNoCambiado: boolean = false;
  token: string;

  constructor(
    private router : Router,
    private loginService  : LoginService,
    private sessionService : SessionService
  ) {
    //const tipoUsuarioSunass : boolean = (this.sessionService.getTipoUsuario().includes('SUNASS'));
    //const tipoUsuarioEPS : boolean = (this.sessionService.getTipoUsuario().includes('EPS'));
  }

  ngOnInit(): void {

    this.user = "";
    this.password ="";

  }

  verificarFrm(){
    let result = true;

    if(this.user.trim().length==0){
      this.msjError = INP_USUARIO;
      result = false;
    }

    if(this.password.trim().length==0){
      this.msjError = INP_CONTRASENIA;
      result = false;
    }

    return result;
  }

  iniciarSesion(){

    this.msjError = "";

    if (this.verificarFrm())
    {
      this.spinnerLogin  = true;
      return this.loginService.login(this.user, this.password).subscribe(
        (data:any)=>{
          if(data.success===true){
            this.msjError = "";

            this.sessionService.cargarJwt(data.value);

            let role = this.sessionService.obtenerRoleJwt();

            console.log(role);

            if (role == ROL_ADMINISTRADOR_OTI){
              this.router.navigate(['inicio/usuarios']);
            }
            else if (role == ROL_ADMINISTRADOR_DF){
              this.router.navigate(['inicio/vma']);
            }

            else if (role == ROL_REGISTRADOR){
              this.router.navigate(['inicio/vma']);
            }
            else if (role == ROL_CONSULTOR){  //dhr falta mejorar en el backend, para los   usuario  EPS ,solo puedan ver registros de su EPS
              this.router.navigate(['inicio/vma']);
            }

          } else {
            this.msjError = data.message;
            this.spinnerLogin = false;
          }
        },
        (error)=>{
          this.spinnerLogin = false;
         // this.msjError = "No se ha podido efectuar la validación del usuario";
          if(error.error && error.error.code === 'PASSWORD_NO_CAMBIADO_EXCEPTION') {
            this.isPasswordNoCambiado = true;
            this.token = error.error.token;
          } else {
            this.msjError = MSG_USUARIO_PASS_ERROR;
            this.spinnerLogin = false;
          }
        }
      );
    }
    else{
      return false;
    }
  }


}
