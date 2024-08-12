import { Component, Input, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../../environments/environment';
import { LoginService } from 'src/app/_service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../_service/user.service';
import { SessionService } from 'src/app/_service/session.service';
import { Module } from './module';


declare const $:any;
declare const attachEventsToPushMenu: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  userName : string;

  shortName : string;
  role : string;

  token : any;
  tituloModulo : string;
  modules : Module[] = [];

  optionRepVarGestionActive : string = "";
  optionRepVarOperacionalActive : string = "";
  optionRepParamCalidadActive : string = "";

  constructor(
    private loginService : LoginService,
    private router : Router,
    private sessionService: SessionService,
    private usuarioService : UserService, 
    public route : ActivatedRoute
  ) {
  }

  ngOnInit(): void {

    

    /*
    this.usuarioService.findModules().subscribe((response:any)=>{
      
      if(response.success){
        this.modules = response.items;
        this.shortName = this.sessionService.obtenerShortNameJwt();
        this.role = this.sessionService.obtenerRoleJwt();
      }

    });
    */
    
    /*this.modules = [ 
      
      {
        route : "usuarios",
        label : "Administracion de Usuarios",
        icon : ""
      },
      {
        route : "empresa",
        label : "Administracion de Empresas",
        icon : ""
      },
      {
        route : "ficha-registro",
        label : "Aperturar ficha de registro VMA",
        icon : ""
      },
      {
        route : "vma",
        label : "Registrar VMA",
        icon : ""
      },
      {
        route : "reporte",
        label : "Reportes e Indicadores",
        icon : ""
      },
      {
        route : "anexos",
        label : "Anexos",
        icon : ""
      },
    ]*/

   // this.renderModules();
    this.shortName = this.sessionService.obtenerShortNameJwt();
    this.role = this.sessionService.obtenerRoleJwt();
    this.renderModules(this.role);
    //console.log("rol: ", this.role); //dhr

  }

  redimensiona(){
    attachEventsToPushMenu();
  }

  cerrarSession1(){
    this.sessionService.cerrarSession();
    return false;
  }

  renderModules(role: string){
    console.log("rol : ", role); //dhr

    const rol = role;
   if(rol ==="Administrador OTI"){

    this.modules = [ 
      {
        route : "usuarios",
        label : "Administración de Usuarios",
        icon : "pi pi-users"
      }
    ]

   }else if(rol ==="Administrador DAP"){
    this.modules = [ 
      
      {
        route : "empresa",
        label : "Administracion de Empresas",
        icon : "pi pi-home"
      },
      {
        route : "ficha-registro",
        label : "Periodo de registro VMA",
        icon : "pi pi-calendar-plus"
      },
      {
        route : "vma",
        label : "Registrar VMA",
        icon : "pi pi-check-square"
      },
      {
        route : "reporte",
        label : "Reportes e Indicadores",
        icon : "pi pi-chart-bar"
      },
      {
        route : "anexos",
        label : "Anexos",
        icon : "pi pi-table"
      },
    ]


   }else if(rol ==="Registrador"){

    this.modules = [ 
      
      {
        route : "vma",
        label : "Registrar VMA",
        icon : "pi pi-check-square"
      },
      {
        route : "reporte",
        label : "Reportes e Indicadores",
        icon : "pi pi-chart-bar"
      },
      {
        route : "anexos",
        label : "Anexos",
        icon : "pi pi-table"
      },
    ]

   }
   else if(rol ==="Consultor"){

    this.modules = [ 
     
      {
        route : "reporte",
        label : "Reportes e Indicadores",
        icon : "pi pi-chart-bar"
      },
      {
        route : "anexos",
        label : "Anexos",
        icon : "pi pi-table"
      },
    ]
   }
  }

}
