import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MessageService} from 'primeng/api';
import { RegistroVmaRequest } from 'src/app/_model/registroVMARequest';
import { RespuestaDTO } from 'src/app/_model/respuestaRequest';
import { Alternativa } from 'src/app/_model/alternativa';
import { Cuestionario } from 'src/app/_model/cuestionario';
import { Pregunta } from 'src/app/_model/pregunta';
import { Seccion } from 'src/app/_model/seccion';
import { TipoPregunta } from 'src/app/_model/tipo-pregunta';
import { CuestionarioService } from 'src/app/_service/cuestionario.service';
import { VmaService } from 'src/app/_service/vma.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-registrar-vma',
  templateUrl: './registrar-vma.component.html',
  styleUrls: ['./registrar-vma.component.css'],
  providers: [MessageService]
})


export class RegistrarVmaComponent implements OnInit {
  cuestionario: Cuestionario;
  registroForm: FormGroup;
  //formAdjuntar: FormGroup;// sera un form estatico con los botones de adjuntar archivos
  secciones: Seccion[] = [];

  formularioGeneral: FormGroup;
  idRegistroVMA: number = null;
  formularioValido: boolean = false;
  seccionActiva: number; // Variable para almacenar el índice de la sección activa

  isGreenTab = true; // para cambiar al color verde en el tab


  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private cuestionarioService: CuestionarioService,
    private vmaService: VmaService,
    private activatedRoute: ActivatedRoute
  ) {
    this.formularioGeneral = this.fb.group({
      secciones: this.fb.array([])
    });

  }

  ngOnInit(): void {

  this.registroForm = this.fb.group({
    tipo: ['EPS', Validators.required],
    perfil: ['', Validators.required],
    unidadOrganica: [''],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    eps: ['', Validators.required],
    usuario: [''],
    username: [''],
    password: ['', Validators.required],
    telefono: ['', Validators.required],
    estado: [true]
  });

 /* this.formAdjuntar = new FormGroup({

  })*/

  this.activatedRoute.params.subscribe(params => {
    this.idRegistroVMA = params['id'];

    if(this.idRegistroVMA) {
      this.cuestionarioService.cuestionarioConRespuestas(this.idRegistroVMA).subscribe((response: any) => {
        this.cuestionario = response.item;
        this.buildForm();
      })
    } else {
      this.cuestionarioService.findCuestionarioByIdMax().subscribe((response: any) => {
        this.cuestionario = response.item;
        this.buildForm();
      })
    }
  })
  }

  guardar(isGuardadoCompleto: boolean){
    const preguntasArray = this.formularioGeneral.value.secciones.map(seccion => seccion.preguntas);
    let preguntas: Pregunta[] = preguntasArray.reduce((acc, cur) => acc.concat(cur), []);
    const respuestas: RespuestaDTO[] = [];
    preguntas = preguntas.filter(pregunta => pregunta.respuesta || (pregunta.tipoPregunta === TipoPregunta.NUMERICO && pregunta.alternativas.length > 0))
    preguntas.forEach(pregunta => {
      if(pregunta.tipoPregunta === TipoPregunta.NUMERICO && pregunta.alternativas.length > 0) {
        pregunta.alternativas.forEach(alternativa => {
          if(alternativa.respuesta) {
            const respuesta = new RespuestaDTO();
            respuesta.idRespuesta = alternativa.respuestaDTO?.idRespuesta;
            respuesta.idPregunta = pregunta.idPregunta;
            respuesta.respuesta = alternativa.respuesta;
            respuesta.idAlternativa = alternativa.idAlternativa;
            respuesta.idRegistroVMA = this.idRegistroVMA;
            respuestas.push(respuesta);
          }
        })
      } else {
        respuestas.push(this.mapToRespuestaDTO(pregunta));
      }
    })

    if(respuestas.length === 0) {
      
      Swal.fire('Guardado progresivo', 'Debe responder al menos una pregunta','info');
      return;
    }

    const registroVMA = new RegistroVmaRequest();
    registroVMA.registroValido = isGuardadoCompleto;
   // registroVMA.idEmpresa = 1;   //temporal, hasta definir
    registroVMA.respuestas = respuestas;
    
    if(this.idRegistroVMA) {
      this.vmaService.updateRegistroVMA(this.idRegistroVMA, registroVMA)
          .subscribe(
            () => {
              Swal.fire('Registro actualizado', isGuardadoCompleto ? 'Su información ha sido registrada y enviada.' : 'Se ha realizado el guardado progresivo','success');
              //this.router.navigate(['/inicio/vma']); recomendable
              this.onBackToList();//temporal, no  recomendable
            }
          );
    } else {
      this.vmaService.saveRegistroVMA(registroVMA).subscribe(
        () => {
          Swal.fire('Cuestionario guardado',  isGuardadoCompleto? 'Su información ha sido registrada y enviada.' : 'Registrado guardado parciamente','success');
          // this.router.navigate(['/inicio/vma']);
          this.onBackToList();//temporal, no  recomendable
          this.vmaService.sendRegistroCompleto(true);
        }
      );
    }
  }

  guardadoCompleto(): void {
    this.addValidatorsToRespuesta(true);
    if(this.formularioValido) {
      this.guardar(true);
    } else {
      this.formularioGeneral.markAllAsTouched();
      Swal.fire('Registrado final','Para registrar todo, debe llenar el cuestionario.','info')
    }
  }

  guardadoParcial(): void {
    this.addValidatorsToRespuesta(false);
    this.guardar(false);
  }

  private mapToRespuestaDTO(pregunta: Pregunta): RespuestaDTO {
    const respuesta = new RespuestaDTO();
        respuesta.idRespuesta = pregunta.respuestaDTO?.idRespuesta;
        respuesta.idPregunta = pregunta.idPregunta;
        respuesta.respuesta = pregunta.respuesta;
        respuesta.idRegistroVMA = this.idRegistroVMA;
    return respuesta;
  }

  buildForm() {
    const formGroup = this.cuestionario.secciones.map(seccion => {
      const preguntasFormGroup = seccion.preguntas.map(pregunta => {
        return this.fb.group({
          idPregunta: [pregunta.idPregunta],
          texto: [pregunta.descripcion],
          tipoPregunta: [pregunta.tipoPregunta],
          alternativas: this.fb.array(
            pregunta.alternativas.map(alternativa => this.buildAlternativas(alternativa, pregunta.tipoPregunta))
          ),
          respuesta: [pregunta.respuestaDTO?.respuesta],
          respuestaDTO: this.buildRespuestaForm(pregunta.respuestaDTO)
        });
      });
  
      return this.fb.group({
        idSeccion: [seccion.idSeccion],
        titulo: [seccion.nombre],
        preguntas: this.fb.array(preguntasFormGroup)
      });
    });
  
    this.formularioGeneral = this.fb.group({
      secciones: this.fb.array(formGroup)
    });
  }

  private addValidatorsToRespuesta(agregarValidacion: boolean) {
    const secciones = this.formularioGeneral.get('secciones') as FormArray;
    this.formularioValido = agregarValidacion;
    secciones.controls.forEach(seccion => {
      const preguntas = seccion.get('preguntas') as FormArray;
      
      preguntas.controls.forEach(pregunta => {
        const respuestaControl = pregunta.get('respuesta');
        const alternativasControl = pregunta.get('alternativas').value as FormArray;
        if ((pregunta.get('tipoPregunta').value !== TipoPregunta.NUMERICO && alternativasControl.length === 0) && respuestaControl) {
          respuestaControl.setValidators(agregarValidacion ? [Validators.required] : []);
          respuestaControl.updateValueAndValidity();

          if (!respuestaControl.valid) {
            this.formularioValido = false;
          }
        }

        const alternativas = pregunta.get('alternativas') as FormArray;
        alternativas.controls.forEach(alternativa => {
          const respuestaAlternativaControl = alternativa.get('respuesta');
          if (pregunta.get('tipoPregunta').value === TipoPregunta.NUMERICO && respuestaAlternativaControl) {
            respuestaAlternativaControl.setValidators(agregarValidacion ? [Validators.required] : []);
            respuestaAlternativaControl.updateValueAndValidity();
  
            if (!respuestaAlternativaControl.valid) {
              this.formularioValido = false;
            }
          }
        })
      });
  
      seccion.updateValueAndValidity();
    });
  
    this.formularioGeneral.updateValueAndValidity();
  }

  private buildRespuestaForm(respuesta: RespuestaDTO) {
    return !respuesta ? null : this.fb.group({
      idRespuesta: [respuesta.idRespuesta],
      idPregunta: [respuesta.idPregunta],
      idAlternativa: [respuesta.idAlternativa],
      idRegistroVMA: [respuesta.idRegistroVMA]
    })
  }


  private buildAlternativas(alternativa: Alternativa, tipoPregunta: TipoPregunta) {
    switch (tipoPregunta) {
      case TipoPregunta.NUMERICO:
        return this.fb.group({
          idAlternativa: [alternativa.idAlternativa],
          nombreCampo: [alternativa.nombreCampo],
          respuesta: [alternativa.respuestaDTO?.respuesta],
          respuestaDTO: this.buildRespuestaForm(alternativa.respuestaDTO)
        });
      case TipoPregunta.RADIO:
        return this.fb.group({
          idAlternativa: [alternativa.idAlternativa],
          nombreCampo: [alternativa.nombreCampo]
        });
        default:
        return null;
    }
  }

  seccionesForm(): FormArray {
    return this.formularioGeneral.get('secciones') as FormArray;
  }

  preguntasForm(seccion: AbstractControl): FormArray {
    return seccion.get('preguntas') as FormArray;
  }

  alternativasForm(pregunta: AbstractControl): FormArray {
    return pregunta.get('alternativas') as FormArray;
  }

  onCancelSave(){
    Swal.fire({
      title: "Desea cancelar el registro?",
      text: "Si cancela el registro toda la información ingresada y/o seleccionada será borrada!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2A3D",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "SI",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cancelado.",
          text: "No se ha registrado o actualizado.",
          icon: "error"
        });
        //this.backTo();
        this.router.navigate(['/inicio/vma']);
      }
    });
  }

  onBackToList(){
    this.router.navigate(['/inicio/vma']).then(() => {
      // es para forzar la recarga del listado por el momento.
     window.location.reload();
    });
    this.router.navigate(['/inicio/vma']);
    
  }
  
  onRadioButtonChange(seccion: AbstractControl, valor: string): void {
    console.log('valor -' , valor);
    if (valor === 'No') {
      this.deshabilitarCamposDeTexto(seccion as FormGroup);
    } else {
      this.habilitarCamposDeTexto(seccion as FormGroup);
    }
  }
  
  deshabilitarCamposDeTexto(seccion: FormGroup): void {
    const preguntas = this.preguntasForm(seccion);
    preguntas.controls.forEach(pregunta => {
      console.log('pregunta.get(tipoPregunta).value -' , pregunta.get('tipoPregunta').value);
      if (pregunta.get('tipoPregunta').value === 'NUMERICO' || pregunta.get('tipoPregunta').value === 'TEXTO' ) {
        pregunta.get('respuesta').disable();
      }
    });
  }

  habilitarCamposDeTexto(seccion: FormGroup): void {
    const preguntas = this.preguntasForm(seccion);
    preguntas.controls.forEach(pregunta => {
      if (pregunta.get('tipoPregunta').value === 'NUMERICO' || pregunta.get('tipoPregunta').value === 'TEXTO' ) {
        pregunta.get('respuesta').enable();
      }
    });
  }
}
