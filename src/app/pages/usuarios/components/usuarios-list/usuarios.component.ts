import {Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/pages/usuarios/services/user.service';
import { FormControl,FormBuilder, FormGroup } from '@angular/forms';
import { User } from 'src/app/pages/usuarios/models/user';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Table } from 'primeng/table';
import {LazyLoadEvent} from "primeng/api";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs/operators";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  @ViewChild('myTable') table: Table;
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
  searchFormControl: FormControl = new FormControl('');

  paramsPagination: ParamsPagination;
  numeroPagina: number = 0;
  private pageUsers$: Subscription;
  modalAbierto: boolean;
  usernameSeleccionado: string;

  constructor(
    public route : ActivatedRoute,
    private router: Router,
    private userService : UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter(text => text.length > 2 || text === ''),
        tap(() => this.listUsers())
      )
      .subscribe();
  }

  initListUsers() {
    this.showResultados = false;
    this.onQueryPageUser();

  }

  redirectToForm(){
    this.router.navigate(['/inicio/usuarios/registrar-usuario']);
  }
  
  redirectToFormUpdate(idUser : number){
    console.log('redirectToFormUpdate -> idUser:', idUser);
    this.router.navigate(['/inicio/usuarios/editar-usuario/'+idUser]);
  }

  listUsers(event?: LazyLoadEvent): void {
    if(event) {
      this.first = event.first! / event.rows!;
      this.rows = event.rows!;
    } else {
      this.first = 0;
      this.rows = 10;
      this.goToFirstPage();
    }
    this.userService.searchUsers(this.first, this.rows, this.searchFormControl.value)
      .subscribe(response => {
        this.ListUser = response.content;
        this.totalRecords = response.totalElements;
      });
  }


  onQueryPageUser() {

    this.userService.findAll().subscribe(

      (data:any) => {
        console.log("params ",data);
      this.ListUser= (data.content || data).map((item: User,index: number)=>({
        ...item,
        index: index + 1
      }));;
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
    this.currentPage = pageNo;
  }

  pageChanged(event: any): void {
    console.log('Page changed to: ' + event.page);
    console.log('Number items per page: ' + event.itemsPerPage);
    this.cantidadRegistrosLista();
    this.userService.page( event.page,this.sizeSort).subscribe((data:any) => {

      this.ListUser=data.content;
    });
  }

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

  goToFirstPage(): void {
    this.table.first = 0;
    this.table.onLazyLoad.emit({ first: 0, rows: this.table.rows, sortField: this.table.sortField, sortOrder: this.table.sortOrder });
  }

  cambiarPasswordUsuario(usuername: string): void {
    this.modalAbierto = true;
    this.usernameSeleccionado = usuername;
  }
}
