import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { SessionService } from 'src/app/_service/session.service';
import { UserService } from '../usuarios/services/user.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css']
})
export class ModulosComponent implements OnInit {

  userName : string;
  token : any;
  tituloModulo : string = "";
  modules : any[] = [];

  constructor(
    private loginService : LoginService,
    private usuarioService : UserService,
    private sessionService : SessionService,
    public route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    
   
    this.usuarioService.findModules().subscribe((response:any)=>{

      if(response.success){
        this.modules = response.items;
        
        this.userName = this.sessionService.obtenerSubjectJwt();
      }
    });
  }

  cerrarSession(){
    //this.loginService.cerrarSession();
    this.sessionService.cerrarSession();
    return false;
  }

}
