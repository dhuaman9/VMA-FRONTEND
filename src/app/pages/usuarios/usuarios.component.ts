import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/_service/user.service';
//import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/_model/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

 // @ViewChild('myModal') public myModal: ModalDirective;//dhr
  @ViewChild('dt1') dt1: Table; //dhr

  isLoading = false;
  showResultados = false;

  user : User;
  ListUser: User[];

  registerForm: FormGroup;

//paginacion
  sizeSort: number=10;
  currentPage: number= 0;
  smallnumPages: number;
  totalItems: number; //total de la lista
  maxSize: number = 5; //total de numeros en la paginacion 1,2,3,4,5
  first = 0;
  rows = 10;
  totalRecords = 0;

  paramsPagination: ParamsPagination;
  numeroPagina: number = 0;
  private pageUsers$: Subscription;

  constructor(
    public route : ActivatedRoute,
    private router: Router,
    private userService : UserService,
    private fb: FormBuilder
  ) { 

   // this.paramsPagination = new ParamsPagination(0,1,10,0);
 
  }

  

  ngOnInit(): void {
  /*  this.pageUsers$ = this.userService.pageUsers$.subscribe(pageUsers => {
      if (pageUsers != null){
        this.ListUser = pageUsers.content;
        this.paramsPagination.pageCount = pageUsers.totalElements;
        this.numeroPagina = 1;
        this.currentPage = 0;
      }
    });*/
    this.initListUsers();
 
  }

  /**
   * evento que se ejecuta al destruirse el componente
   */
 /* ngOnDestroy(): void {
    this.pageUsers$.unsubscribe();
  }*/
  
  initListUsers() {
    this.showResultados = false;
   // this.paramsPagination = new ParamsPagination(0,1,10,0);
    this.onQueryPageUser();
    
  }

  redirectToForm(){
    this.router.navigate(['/inicio/usuarios/registrar-usuario']);
  }
  redirectToFormUpdate(idUser : number){
    console.log('redirectToFormUpdate -> idUser:', idUser);
    this.router.navigate(['/inicio/usuarios/editar-usuario/'+idUser]);
  }

  listar(){
    this.userService.page(this.currentPage, 5).subscribe((data:any) => {
      console.log(data);
      this.ListUser=data.content;
      this.showResultados = true;
      this.isLoading = false;
    });
  }

  /**
   * Funcion para la paginacion en la tabla de consulta de usuario
   * @param paramsPag 
   */
  onQueryPageUser() {
   // console.log("paramsPag",paramsPag);
    this.userService.findAll().subscribe(
      //this.ListUser=data.content;
      /*this.showResultados = true;
      this.isLoading = false;
      this.paramsPagination.pageCount = data.totalElements;
      this.numeroPagina = paramsPag.first!;
      this.currentPage = paramsPag.page!;*/
      (data:any) => {
        console.log("params ",data);
      this.ListUser= data.content || data;
      this.showResultados = true;
      this.totalRecords = data.totalElements || this.ListUser.length;
      this.isLoading = false;
      },
      error => {
        console.error('No se encontro data de usuarios', error);
      }

    );
  }

  
  cantidadRegistrosLista(){
    this.userService.findAll().subscribe(data => {
      this.totalItems=data.length;
    });
  }

  setPage(pageNo: number): void {
    console.log(' setPage: ' + pageNo);
    this.currentPage = pageNo;
  }

  pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.cantidadRegistrosLista();
    this.userService.page( event.page,this.sizeSort).subscribe((data:any) => {
      console.log(data);
      this.ListUser=data.content;
    });
  }

//filtrar datos en la tabla
 /* filter(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt1.filterGlobal(input.value, 'contains');
  }*/

 /**
   * Evento para aplicar filtro a la pagina actual en la consulta de usuarios
   * @param table 
   * @param event 
   */
 onFilterTableGlobal(table: Table, event:any){

  const filterValue = (event.target as HTMLInputElement).value;
  if (table) {
    table.filterGlobal(filterValue, 'contains');
  }

}

}
