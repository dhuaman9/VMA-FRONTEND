import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PrimeNGConfig } from 'primeng/api';

declare const updateTituloModulo: any;
declare const updateMenuOption: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  title = 'vmafrontend';

  subs: Array<Subscription> = [];

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private config: PrimeNGConfig
  ) {

    this.subs[0] = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute.snapshot),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
    )
    .subscribe((route: ActivatedRouteSnapshot) => {
      
      let infoRouteData = route.data;
      
      if(infoRouteData){
        let tituloModulo = infoRouteData.tituloModulo;
        let menuOption = infoRouteData.menuOption;
        
        if(tituloModulo){ 
          updateTituloModulo(tituloModulo);
        }

        if(menuOption){ 
          updateMenuOption(menuOption);
        }
      }
    });
  }
  
  ngOnInit() {
    this.config.setTranslation({
        accept: 'Accept',
        reject: 'Cancel',
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    });
}



}
