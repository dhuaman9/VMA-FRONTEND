
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../_service/login.service';
import { SessionService } from 'src/app/_service/session.service';
import { INP_USUARIO, INP_CONTRASENIA, MSG_USUARIO_PASS_ERROR, ROL_ADMINISTRADOR_OTI, 
   ROL_ADMINISTRADOR_DAP, ROL_REGISTRADOR, ROL_CONSULTOR} from '../../utils/var.constant';


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

  constructor(
    private router : Router,
    private loginService  : LoginService,
    private sessionService : SessionService
  ) { 

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
            else if (role == ROL_ADMINISTRADOR_DAP){
              this.router.navigate(['inicio/vma']);
            }

            else if (role == ROL_REGISTRADOR){
              this.router.navigate(['inicio/vma']);
            }
            else if (role == ROL_CONSULTOR){
              this.router.navigate(['inicio/reporte']);
            }
            
          } else {
            this.msjError = data.message;
            this.spinnerLogin = false;
          }
        },
        (error)=>{
         // this.msjError = "No se ha podido efectuar la validación del usuario";
          this.msjError = MSG_USUARIO_PASS_ERROR;
          this.spinnerLogin = false;
        }
      );
    }
    else{
      return false;
    }
  }


}
