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
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { IConfig, NgxMaskModule } from 'ngx-mask';

import { NgSelectModule } from '@ng-select/ng-select';
import { interceptorProvider } from './_service/interceptor.service';
import { AlphabeticInputDirective } from './utils/validate-inputs';
import { TelefonoInputDirective } from './utils/validate-inputs';
import { UserNameInputDirective } from './utils/validate-inputs';
import { ReporteService } from 'src/app/pages/reportes/services/reporte.service';
import { PieChartComponent } from './pages/reportes/pie-chart/pie-chart.component';
import { BarChartComponent } from './pages/reportes/bar-chart/bar-chart.component';
import { GlobalFormsComponentsModule } from './shared/components/forms/global-forms.module';


// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalContentComponent } from './pages/register/modal-content/modal-content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageService } from 'primeng/api';
import {MessageModule} from "primeng/message";
import {SharedModule} from "./shared/shared.module";
import {MenuModule} from "primeng/menu";
import { RecuperarPasswordComponent } from './pages/anonimo/components/recuperar-password/recuperar-password.component';
//import { ReporteComponent } from './pages/reportes/components/reporte.component';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export function tokenGetter(){
  //return sessionStorage.getItem(environment.TOKEN_NAME);
  return localStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    ModulosComponent,
    //ReporteComponent,
    ModalContentComponent,
    AlphabeticInputDirective,
    TelefonoInputDirective,
    UserNameInputDirective,
   // PieChartComponent,
    //BarChartComponent,
    RecuperarPasswordComponent
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
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: environment.ALLOWED_DOMAINS,
                disallowedRoutes: environment.DISALLOWED_ROUTES
            }
        }),
        NgxMaskModule.forRoot(options),
        PaginationModule.forRoot(),
        NgbModule,
        BrowserAnimationsModule,
        GlobalFormsComponentsModule,
        SharedModule,
        MessageModule,
        MenuModule
    ],
  providers: [MessageService,DatePipe,
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
