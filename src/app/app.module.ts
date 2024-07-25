import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from './../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { LoadingComponent } from './pages/loading/loading.component';

import { FormsSelect2Component } from './pages/forms/forms-select2/forms-select2.component';

import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { interceptorProvider } from './_service/interceptor.service';
import { ErrorValidationComponent } from './pages/forms/error-validation/error-validation.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { FichaRegistroComponent } from './pages/ficha-registro/ficha-registro.component';
import { AnexosComponent } from './pages/anexos/anexos.component';
import { VmaComponent } from './pages/vma/vma.component';
import { RegistrarVmaComponent } from './pages/vma/registrar-vma/registrar-vma.component';
import { AlphabeticInputDirective } from './utils/validate-inputs';
import { TelefonoInputDirective } from './utils/validate-inputs';
import { UserNameInputDirective } from './utils/validate-inputs';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { EditarUsuarioComponent } from './pages/usuarios/editar-usuario/editar-usuario.component';
import { RegistrarUsuarioComponent } from './pages/usuarios/registrar-usuario/registrar-usuario.component';
import { ModalContentComponent } from './pages/register/modal-content/modal-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Primeng components
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FieldsetModule } from 'primeng/fieldset';
import { GlobalFormsComponentsModule } from './shared/components/forms/global-forms.module';
import { AltaEditEmpresaComponent } from './pages/empresa/alta-edit-empresa/alta-edit-empresa.component';
import { RegisterEditFichaComponent } from './pages/ficha-registro/register-edit-ficha/register-edit-ficha.component';
import { AccordionModule } from 'primeng/accordion';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import {TooltipModule} from 'primeng/tooltip';
import { ChartModule } from 'primeng/chart';

import {OrderListModule} from 'primeng/orderlist';
import { ReporteService } from 'src/app/_service/reporte.service';
import { PieChartComponent } from './pages/reporte/pie-chart/pie-chart.component';
import { BarChartComponent } from './pages/reporte/bar-chart/bar-chart.component';


const PRIMENG_COMPONENTS = [
  TableModule,
  PaginatorModule,
  ButtonModule,
  InputTextModule,
  DynamicDialogModule,
  RadioButtonModule,
  DropdownModule,
  InputSwitchModule,
  DialogModule,
  KeyFilterModule,
  FieldsetModule,
  CalendarModule,
  BrowserModule,
  BrowserAnimationsModule,
  AccordionModule,
  ToastModule,
  SplitterModule,
  FileUploadModule,
  TooltipModule,
  ChartModule,
  OrderListModule
]
export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME)
}

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    ModulosComponent,
    LoadingComponent,
    FormsSelect2Component,
    ErrorValidationComponent,
    UsuariosComponent,
    RegistrarUsuarioComponent,
    EditarUsuarioComponent,
    ReporteComponent,
    EmpresaComponent,
    FichaRegistroComponent,
    AnexosComponent,
    VmaComponent,
    RegistrarVmaComponent,
    ModalContentComponent,
    AltaEditEmpresaComponent,
    RegisterEditFichaComponent,
    AlphabeticInputDirective,
    TelefonoInputDirective,
    UserNameInputDirective,
    PieChartComponent,
    BarChartComponent
  ],
  imports: [
   
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
   // NgbModule,
    JwtModule.forRoot({
      config : { 
        tokenGetter : tokenGetter,
        allowedDomains : environment.ALLOWED_DOMAINS,
        disallowedRoutes : environment.DISALLOWED_ROUTES
      }
    }),
    NgxMaskModule.forRoot(options),
    PaginationModule.forRoot(),
    NgbModule,
    BrowserAnimationsModule,
    GlobalFormsComponentsModule,
    PRIMENG_COMPONENTS
  ],
  providers: [
    { provide : LocationStrategy, useClass: HashLocationStrategy },
    interceptorProvider, ReporteService
  ],
  bootstrap: [AppComponent],
  exports: [
    AlphabeticInputDirective,
    TelefonoInputDirective,
    UserNameInputDirective
  ]
})
export class AppModule { }
