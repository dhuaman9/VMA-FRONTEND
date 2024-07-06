import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../_service/login.service';
import { environment } from './../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SessionService } from 'src/app/_service/session.service';

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
  ) { }

  ngOnInit(): void {
    this.user = "";
    this.password ="";
  }

  verificarFrm(){
    let result = true;

    if(this.user.trim().length==0){
      this.msjError = "Ingresar el usuario";
      result = false;
    }

    if(this.password.trim().length==0){
      this.msjError = "Ingresar la contraseña";
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

            if (role == "Administrador OTI"){
              this.router.navigate(['inicio/usuarios']);
            }
            else if (role == "Administrador DAP"){
              this.router.navigate(['inicio/empresa']);
            }

            else if (role == "Registrador"){
              this.router.navigate(['inicio/vma']);
            }
            else if (role == "Consultor"){
              this.router.navigate(['inicio/reporte']);
            }
            

          } else {
            this.msjError = data.message;
            this.spinnerLogin = false;
          }
        },
        (error)=>{
         // this.msjError = "No se ha podido efectuar la validación del usuario";
          this.msjError = "Usuario y/o contraseña incorrectos";
          this.spinnerLogin = false;
        }
      );
    }
    else{
      return false;
    }
  }

  eyePaswword(){
    
  }

}
