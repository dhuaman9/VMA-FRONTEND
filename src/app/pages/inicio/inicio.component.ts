import { Component, Input, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from './../../../environments/environment';
import { LoginService } from 'src/app/_service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../usuarios/services/user.service';
import { SessionService } from 'src/app/_service/session.service';
import { Module } from './module';
import {Message, MessageService} from 'primeng/api';

declare const $:any;
declare const attachEventsToPushMenu: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  msgs1: Message[];
  diasFaltantes: number = 24;

  userName : string;

  shortName : string;
  role : string;

  token : any;
  tituloModulo : string;
  modules : Module[] = [];

  optionRepVarGestionActive : string = "";
  optionRepVarOperacionalActive : string = "";
  optionRepParamCalidadActive : string = "";

  //para renderizar el p-message, alerta de registro vma

  isRoleRegistrador: boolean = this.sessionService.obtenerRoleJwt().toUpperCase() === 'REGISTRADOR';

  constructor(
    private loginService : LoginService,
    private router : Router,
    private sessionService: SessionService,
    private usuarioService : UserService,
    public route : ActivatedRoute,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.msgs1 = [
      {severity:'warn', summary:'Alerta', detail: `Tiene ${this.diasFaltantes} días restantes para registrar la información correspondiente a VMA. Por favor, asegúrate de completar el registro antes de la fecha límite.`}
    ];
    

   
   // this.renderModules();
    this.shortName = this.sessionService.obtenerShortNameJwt();
    this.role = this.sessionService.obtenerRoleJwt();
    this.userName = this.sessionService.obtenerUserNameJwt();
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
    const esAdministradorOTI: boolean = role === "Administrador OTI";
    const esAdministradorDAP: boolean = role === "Administrador DAP";
    const esRegistrador: boolean = role === "Registrador";
    const esConsultor: boolean = role === "Consultor";

    this.modules = [
      {
        route : "usuarios",
        label : "Usuarios",
        icon : "pi pi-users",
        activo: esAdministradorOTI
      },
      {
        route : "empresa",
        label : "Empresas",
        icon : "pi pi-home",
        activo: esAdministradorDAP
      },
      {
        route : "ficha-registro",
        label : "Periodos de registro VMA",
        icon : "pi pi-calendar-plus",
        activo: esAdministradorDAP
      },
      {
        route : "vma",
        label : "Registrar VMA",
        icon : "pi pi-check-square",
        activo: esAdministradorDAP || esRegistrador
      },
      {
        route : "reporte",
        label : "Reportes e Indicadores",
        icon : "pi pi-chart-bar",
        activo: !esAdministradorOTI
      },
      {
        route : "anexos",
        label : "Anexos",
        icon : "pi pi-table",
        activo: !esAdministradorOTI
      },
    ]
  }


}