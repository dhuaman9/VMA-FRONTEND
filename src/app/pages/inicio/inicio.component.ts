import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from 'src/app/_service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../usuarios/services/user.service';
import { SessionService } from 'src/app/_service/session.service';
import { Module } from './module';
import {Message, MessageService} from 'primeng/api';
import {RegistroVMAService} from 'src/app/pages/vma/services/registroVMA.service';
import {RegistroVMA} from 'src/app/pages/vma/models/registroVMA';
import { FichaRegistroService } from '../ficha-registro/services/ficha-registro.service';


declare const $:any;
declare const attachEventsToPushMenu: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  msgs1: Message[];
  diasFaltantes: number;
  registroVMA: RegistroVMA | null = null;

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
    private messageService: MessageService,
    private registroVmaService: RegistroVMAService,
    private fichaRegistroService: FichaRegistroService
  ) {
  }

  ngOnInit(): void {
    this.fichaRegistroService.cantidadDiasFaltantesVMA()
    .subscribe(dias => {
      this.diasFaltantes = dias;

      // Asegúrate de que dias no sea undefined
      if (this.diasFaltantes !== undefined) {
        this.msgs1 = [
          {
            severity: 'warn',
            summary: 'Alerta',
            detail: `Tiene ${this.diasFaltantes} días restantes para registrar la información correspondiente a VMA. Por favor, asegúrate de completar el registro antes de la fecha límite.`
          }
        ];
      } else {
        // Maneja el caso en el que no hay días faltantes
        this.msgs1 = [
          {
            severity: 'info',
            summary: 'Información',
            detail: 'No hay días restantes para el registro.'
          }
        ];
      }
    }, error => {
      console.error('Error al obtener los días faltantes', error);
    });

    this.registroVmaService.obtenerRegistroVMASinCompletar().subscribe(
      (data) => {
        this.registroVMA = data;
      },
      (error) => {
        console.error('Error al obtener el periodo activo', error);
      }
    );
   
   // this.renderModules();
    this.shortName = this.sessionService.obtenerShortNameJwt();
    this.role = this.sessionService.obtenerRoleJwt();
    this.userName = this.sessionService.obtenerUserNameJwt();
    this.renderModules(this.role);

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
        activo: esAdministradorDAP || esConsultor
      },
      {
        route : "anexos",
        label : "Anexos",
        icon : "pi pi-table",
        activo: esAdministradorDAP || esConsultor
      },
    ]
  }


}
