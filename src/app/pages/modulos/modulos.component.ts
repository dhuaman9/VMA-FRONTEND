import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/_service/login.service';
import { SessionService } from 'src/app/_service/session.service';
import { environment } from 'src/environments/environment';
import { ModuleService } from './../../_service/module.service';
import { UserService } from './../../_service/user.service';

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
