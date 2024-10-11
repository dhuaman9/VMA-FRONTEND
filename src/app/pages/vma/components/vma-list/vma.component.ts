import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Empresa} from 'src/app/pages/empresa/models/empresa';
import {RegistroVMA} from 'src/app/pages/vma/models/registroVMA';
import {RegistroVMAService} from 'src/app/pages/vma/services/registroVMA.service';
import {Table} from 'primeng/table';
import {VmaService} from 'src/app/_service/vma.service';
import {SessionService} from 'src/app/_service/session.service';
import {EmpresaService} from 'src/app/pages/empresa/services/empresa.service';
import {FichaRegistroService} from 'src/app/pages/ficha-registro/services/ficha-registro.service';
import { FichaRegistro } from 'src/app/pages/ficha-registro/models/fichaRegistro';
import {debounceTime, distinctUntilChanged, switchMap, tap} from "rxjs/operators";
import Swal from "sweetalert2";
import {LazyLoadEvent} from "primeng/api";
import { ESTADO_COMPLETO, ESTADO_INCOMPLETO, ESTADO_SIN_REGISTRO, 
  ROL_ADMINISTRADOR_DAP, ROL_REGISTRADOR,ROL_CONSULTOR  } from 'src/app/utils/var.constant';

@Component({
  selector: 'app-vma',
  templateUrl: './vma.component.html',
  styleUrls: ['./vma.component.css']
})
export class VmaComponent implements OnInit {

  activeState: boolean[] = [true, false, false];

  //  arreglo con los estados disponibles : completo ,incompleto y sin registro
  estados: string[];

  inputFilterTable: string="";
  filtroForm: FormGroup;

  isLoading = false;
  showResultados = false;
  isEdition = false;
  empresa : Empresa;

  empresasLista: {label: string, value: any}[] = [];

  ListRegistroVMA: RegistroVMA[] = [];
  selectedRegistrosVMA: RegistroVMA[] = [];

  registroForm: FormGroup;

  years = [];

  first = 0;
  rows = 10;
  totalRecords = 0;
  formBusqueda: FormControl = new FormControl('');
  formCheckBox: FormControl = new FormControl(false);
  checkManual: boolean = false;
  registroCompleto: boolean = false; //cambiar por statusRegistroVMA
  
  isRoleRegistrador: boolean;
  //isRoleRegistrador: boolean = this.sessionService.obtenerRoleJwt().toUpperCase().trim() === 'REGISTRADOR';
  isRoleAdmin : boolean ;
  isRoleConsultor: boolean;
  fichaRegistro: FichaRegistro | null = null;

  private lastSearchFilters:{};

  constructor(  public route : ActivatedRoute,
    private router: Router,
    private registroVMAService : RegistroVMAService,
    private vmaService: VmaService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private empresaService : EmpresaService,
    private fichaRegistroService: FichaRegistroService) {

      this.filtroForm = this.fb.group({  //filtros
        estado: [''], // valor por defecto
        eps: [''],
        fechaDesde: [''],
        fechaHasta: [''],
        anio: ['']
      });
  }

  ngOnInit(): void {

    const role = this.sessionService.obtenerRoleJwt().toUpperCase().trim();
    this.isRoleAdmin = role === ROL_ADMINISTRADOR_DAP;
    this.isRoleConsultor= role === ROL_CONSULTOR;
    this.isRoleRegistrador = role === ROL_REGISTRADOR;

   
    this.formBusqueda.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged()
      )
      .subscribe(() =>  this.buscar());
    this.formCheckBox.valueChanges.subscribe(this.toggleSeleccionados);
    this.buscar();
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

    this.estados = [ESTADO_COMPLETO, ESTADO_INCOMPLETO ,ESTADO_SIN_REGISTRO]; //para cargarlos en el combobox

    if(!this.isRoleRegistrador) {
      this.initializeYears();
      this.cargarListaEmpresas(); //carga el listdo de empresas
    }

    this.vmaService.isRegistroCompleto().subscribe(response => this.registroCompleto = response);
    this.vmaService.registroCompleto$.subscribe(response => this.registroCompleto = response);
  
    this.fichaRegistroService.obtenerPeriodoActivo().subscribe(
      (data) => {
        this.fichaRegistro = data;
      },
      (error) => {
        console.error('Error al obtener el periodo activo', error);
      }
    );
  
  }

  private toggleSeleccionados = (seleccionado: boolean): void => {
    if(this.checkManual) {
      return;
    }

    this.ListRegistroVMA.map(item => {
      item.seleccionado = seleccionado;
      return item;
    });
  }

  onCheckboxChange(event: any, item: any): void {
    item.seleccionado = !item.seleccionado;
    this.checkManual = true;
    this.formCheckBox.setValue(this.getRegistrosSeleccionados().length === this.ListRegistroVMA.length);
    this.checkManual = false;
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

   onQueryListRegistroVMA(event?: any) {
   
    const page = event ? Math.floor(event.first / event.rows) : 0;
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

  

  redirectToForm(){
    this.router.navigate(['/inicio/vma/registrar-vma']);
  }
 

  redirectToFormUpdate(id: number){
    this.router.navigate(['/inicio/vma/registrar-vma', id]);// temporal, luego se setea el ID del registro , en el metodo anterior redirectToForm
  }

  //metodo para cambiar de estado de registro vma, de  completo a incompleto.
  cambiarEstadoIncompleto(id: number): void {
    Swal.fire({
      title: "¿Está seguro de cambiar el estado del registro?",
      //text: "Se cambiará el estado del registro a INCOMPLETO",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.first = 0;
        this.rows = 10;
        this.formCheckBox.setValue(false);
        this.vmaService.actualizarEstadoIncompleto(id)
          .pipe(
            tap(this.mostrarMensajeSatisfactorio),
            switchMap(() => this.registroVMAService.searchRegistroVmas(this.first, this.rows, this.formBusqueda.value)),
            tap((response: any) => {
              this.ListRegistroVMA= response.content;
              this.showResultados = true;
              this.totalRecords = response.length;
              this.isLoading = false;
            })
          ).subscribe();

      }
    });

  }

  private mostrarMensajeSatisfactorio = (): void => {
    Swal.fire({
      title: "El registro se ha actualizado!.",
      //text: "Ahora el usuario puede actualizar el registro",
      icon: "success"
    });
  }

  buscar(event?: LazyLoadEvent) {
    this.formCheckBox.setValue(false);
    
    // Determinar el primer elemento y las filas a mostrar
    if (event) {
        this.first = event.first! / event.rows!;
        //this.first = event.first!;
        this.rows = event.rows!;

        /*this.first = event.first || 0;
        this.rows = event.rows || 10;*/

    } else {
        this.selectedRegistrosVMA = [];
        this.first = 0;
        this.rows = 10;
    }

    // Verificar si el formulario de filtros es válido
    if (this.filtroForm.valid) {
        this.lastSearchFilters = this.filtroForm.value;
        const formValues = this.filtroForm.value;

        // Resetear el paginador al aplicar el filtro
        //this.first = 0;

        this.registroVMAService.searchRegistroVmas(
            this.first,
            this.rows,
            this.formBusqueda.value,
            formValues.eps,
            formValues.estado,
            formValues.fechaDesde,
            formValues.fechaHasta,
            formValues.anio
        ).subscribe(response => {
            this.ListRegistroVMA = response.content;
            this.showResultados = true;
            this.totalRecords = response.totalElements;
            // Resetear el paginador al aplicar el filtro
            //this.first = 0;
            this.isLoading = false;
        });
    } 
  }

  descargar(): void {  

      //const filtrosSeleccionados = this.filtroForm.value;
      const filtrosSeleccionados = this.lastSearchFilters;
      const textoBusqueda = this.formBusqueda.value; // Obtén el texto del campo de búsqueda

      // Verifica si hay registros seleccionados
      if (this.getRegistrosSeleccionados().length > 0) {
        // Descarga el reporte basado en los registros seleccionados y el filtro de búsqueda
        this.registroVMAService.descargarReporteRegistrosVMAExcel(this.getRegistrosSeleccionados(), filtrosSeleccionados, textoBusqueda);
      } else {
        // Si no hay registros seleccionados, descarga el reporte basado en los filtros y el texto de búsqueda
        this.registroVMAService.descargarReporteRegistrosVMAExcel([], filtrosSeleccionados, textoBusqueda);
      }
    
  }

  descargarReporteEPSsinRegistroVMA(): void {

    this.registroVMAService.descargarReporteEPSsinRegistroVMA();

  }

  limpiar(){
  
    this.filtroForm.reset(); // Limpia todos los campos del formulario
    this.isLoading = true; // Muestra indicador de carga
    this.first = 0; // Reinicia el primer índice para paginación
    this.rows = 10; // Reinicia el número de filas a mostrar

    // Llama a buscar para recargar la tabla sin filtros
    this.buscar(); 
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

  getRegistrosSeleccionados(): number[] {
    //return this.ListRegistroVMA.filter(registro => registro.seleccionado).map(registro => registro.idRegistroVma);
    return this.selectedRegistrosVMA.map(registro => registro.idRegistroVma);
  }



}