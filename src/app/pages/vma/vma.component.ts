import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { FormBuilder, FormGroup, ValidationErrors, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Empresa } from 'src/app/_model/empresa';
import { RegistroVMA } from 'src/app/_model/registroVMA';
import { RegistroVMAService } from 'src/app/_service/registroVMA.service';
import { Table } from 'primeng/table';
import { VmaService } from 'src/app/_service/vma.service';
import { SessionService } from 'src/app/_service/session.service';
import { EmpresaService } from 'src/app/_service/empresa.service';



@Component({
  selector: 'app-vma',
  templateUrl: './vma.component.html',
  styleUrls: ['./vma.component.css']
})
export class VmaComponent implements OnInit {

  activeState: boolean[] = [true, false, false];

  // Definir un arreglo con los estados disponibles
  estados: string[];

  value1: number = 0;
  inputFilterTable: string="";
  filtroForm: FormGroup;

  isLoading = false;
  showResultados = false;
  isEdition = false;
  empresa : Empresa;

  empresasLista: {label: string, value: any}[] = [];

  ListRegistroVMA: RegistroVMA[];  //pendiente

  registroForm: FormGroup;

  years = [];

  basicData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#42A5F5',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#FFA726',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};



  first = 0;
  rows = 10;
  totalRecords = 0;

  registroCompleto: boolean = false;
  isRoleRegistrador: boolean = this.sessionService.obtenerRoleJwt().toUpperCase() === 'REGISTRADOR';
  isRoleAdminAndConsultor: boolean = this.sessionService.obtenerRoleJwt().toUpperCase() === ('ADMINISTRADOR DAP' || 'CONSULTOR');

 // displayModaAdvice = false;

 //paginacion
  /* currentPage: number= 0;
   paramsPagination: ParamsPagination;
   numeroPagina: number = 0;*/

  constructor(  public route : ActivatedRoute,
    private router: Router,
    private registroVMAService : RegistroVMAService,
    private vmaService: VmaService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private empresaService : EmpresaService) {

      this.filtroForm = this.fb.group({  //filtros
        estado: [''], // valor x defecto
        eps: [''],
        fechaDesde: [''],
        fechaHasta: [''],
        anio: ['']
      });
  }

  ngOnInit(): void {

    this.filtroForm = this.fb.group({
      eps: [''],
      estado: [''],
      fechaDesde: [''],
      fechaHasta: [''],
      anio: ['']
    }, {
      validators: this.fechaComparisonValidator
    });

    this.fechaDesdeListener();

    this.estados = ['COMPLETO', 'INCOMPLETO'];

    this.initializeYears();

    // this.initListRegistroVMA();
    this.buscar();
     //  this.empresa = new Empresa();
    this.cargarListaEmpresas(); //carga el listdo de empresas
    this.vmaService.isRegistroCompleto().subscribe(response => this.registroCompleto = response);
    this.vmaService.registroCompleto$.subscribe(response => this.registroCompleto = response)
  }

  fechaDesdeListener(): void {
    this.filtroForm.get('fechaDesde')?.valueChanges.subscribe(value => {
      const fechaHastaControl = this.filtroForm.get('fechaHasta');
      if (value) {
        fechaHastaControl?.setValidators([Validators.required]);
      } else {
        fechaHastaControl?.clearValidators();
      }
      fechaHastaControl?.updateValueAndValidity();
    });
  }

  initListRegistroVMA() {
    this.showResultados = false;
   // this.paramsPagination = new ParamsPagination(0,1,10,0); //?
    this.onQueryListRegistroVMA();  //dhr
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear; year >= 2022; year--) {
      this.years.push({ label: year.toString(), value: year });
    }
  }

 /* onTabClose(event) {
    this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }

  onTabOpen(event) {
      this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }*/

   onQueryListRegistroVMA(event?: any) {

   // this.isLoading = true;
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : this.rows;
    //console.log("paramsPag",paramsPag);
    this.registroVMAService.findAll().subscribe(

      (data:any) => {
        console.log("params ",data);
      this.ListRegistroVMA= data.content || data;
      this.showResultados = true;
      this.totalRecords = data.totalElements || this.ListRegistroVMA.length;
      this.isLoading = false;
      },
      error => {
        console.error('Error, no hay data de registro VMA', error);
      }
    );
  }

  onFilterTableGlobal(table: Table, event:any){

    const filterValue = (event.target as HTMLInputElement).value;
    if (table) {
      table.filterGlobal(filterValue, 'contains');

    }
  console.log("filterValue-",filterValue);
  }

  /**
   *   onFilterTableGlobal(dt: any, event: Event): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
   *
   *
   */

  redirectToForm(){
    this.router.navigate(['/inicio/vma/registrar-vma']);
  }
  onEditEmpresa(){
    alert("editar empresa");
  }

  redirectToFormUpdate(id: number){
    this.router.navigate(['/inicio/vma/registrar-vma', id]);// temporal, luego se setea el ID del registro , en el metodo anterior redirectToForm
  }


  buscar(){
    console.log(this.filtroForm)
    if(this.filtroForm.valid) {
      const formValues = this.filtroForm.value;
      this.registroVMAService.searchRegistroVmas(
        formValues.eps,
        formValues.estado,
        formValues.fechaDesde,
        formValues.fechaHasta,
        formValues.anio
      ).subscribe(response => {
        this.ListRegistroVMA= response;
        this.showResultados = true;
        this.totalRecords = response.length;
        this.isLoading = false;
      });
    }
  }

  limpiar(){
    this.filtroForm.reset();
  }


  cargarListaEmpresas(): void {
    this.empresaService.findAll().subscribe(

      (data: any[]) => {
        this.empresasLista = data.map(emp => ({
          label: emp.nombre,
          value: emp.idEmpresa
        }));
      },
      (error) => {
        console.error('Error al obtener la lista de las empresas', error);
      }
    );
  }

  fechaComparisonValidator(control: FormGroup): ValidationErrors | null {
    const fechaDesde = control.get('fechaDesde').value;
    const fechaHasta = control.get('fechaHasta').value;

    if (fechaDesde && fechaHasta && new Date(fechaDesde) > new Date(fechaHasta)) {
      return { fechaComparison: true };
    }
    return null;
  }

}