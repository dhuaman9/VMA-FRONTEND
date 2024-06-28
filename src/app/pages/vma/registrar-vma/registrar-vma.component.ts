import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MessageService} from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { RegistroVmaRequest } from 'src/app/_model/registroVMARequest';
import { RespuestaDTO } from 'src/app/_model/respuestaRequest';
import { Alternativa } from 'src/app/_model/alternativa';
import { Cuestionario } from 'src/app/_model/cuestionario';
import { Pregunta } from 'src/app/_model/pregunta';
import { Seccion } from 'src/app/_model/seccion';
import { TipoPregunta } from 'src/app/_model/tipo-pregunta';
import { CuestionarioService } from 'src/app/_service/cuestionario.service';
import { SeccionesService } from 'src/app/_service/secciones.service';
import { VmaService } from 'src/app/_service/vma.service';


@Component({
  selector: 'app-registrar-vma',
  templateUrl: './registrar-vma.component.html',
  styleUrls: ['./registrar-vma.component.css'],
  providers: [MessageService]
})


export class RegistrarVmaComponent implements OnInit {
  cuestionario: Cuestionario;
  registroForm: FormGroup;
  formAdjuntar: FormGroup;// sera un form estatico con los botones de adjuntar archivos
  secciones: Seccion[] = [];
  //cuestionarioForm: FormGroup;  // form padre
  formularioGeneral: FormGroup;

  constructor(
    private seccionesService: SeccionesService,
    private fb: FormBuilder, 
    private cuestionarioService: CuestionarioService,
    private vmaService: VmaService) {}

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

  this.formAdjuntar = new FormGroup({

  })

  this.cuestionarioService.findCuestionarioByIdMax().subscribe((response: any) => {
    this.cuestionario = response.item;
    this.buildForm();
  })
 
  }

  submitForm() {
    console.log("this.registroForm.value-",this.registroForm.value);
  }

  guardar(){
    
    const preguntasArray = this.formularioGeneral.value.secciones.map(seccion => seccion.preguntas);
    const preguntas: Pregunta[] = preguntasArray.reduce((acc, cur) => acc.concat(cur), []);
    const respuestas: RespuestaDTO[] = [];

    preguntas.forEach(pregunta => {
      if(pregunta.tipoPregunta === TipoPregunta.NUMERICO && pregunta.alternativas.length > 0) {
        pregunta.alternativas.forEach(alternativa => {
          const respuesta = new RespuestaDTO();
          respuesta.idPregunta = pregunta.idPregunta;
          respuesta.respuesta = alternativa.respuesta;
          respuesta.idAlternativa = alternativa.idAlternativa;
          respuestas.push(respuesta);
        })
      } else {
        respuestas.push(this.mapToRespuestaDTO(pregunta));
      }
    })

    const registroVMA = new RegistroVmaRequest();
    registroVMA.idEmpresa = 1;   //temporal, hasta definir
    registroVMA.respuestas = respuestas;

    this.vmaService.saveRegistroVMA(registroVMA).subscribe(
      () => console.log("exito")
    );
  }

  private mapToRespuestaDTO(pregunta: Pregunta): RespuestaDTO {
    const respuesta = new RespuestaDTO();
        respuesta.idPregunta = pregunta.idPregunta;
        respuesta.respuesta = pregunta.respuesta;
    return respuesta;
  }

  onCancelEdit(){

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
          respuesta: this.getControlForPregunta(pregunta.tipoPregunta)
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


  private buildAlternativas(alternativa: Alternativa, tipoPregunta: TipoPregunta) {
    switch (tipoPregunta) {
      case TipoPregunta.NUMERICO:
        return this.fb.group({
          idAlternativa: [alternativa.idAlternativa],
          nombreCampo: [alternativa.nombreCampo],
          respuesta: [null]
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
  
  getControlForPregunta(tipoPregunta: TipoPregunta) {
    switch (tipoPregunta) {
      case TipoPregunta.TEXTO:
        return [null, Validators.required];
      case TipoPregunta.NUMERICO:
        return [null, [Validators.required, Validators.pattern('^[0-9]+$')]];
      case TipoPregunta.RADIO:
        return [null, Validators.required];
      default:
        return [''];
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

  registrarFinal(){

  }
}
