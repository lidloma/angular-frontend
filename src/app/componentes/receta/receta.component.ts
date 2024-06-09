import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RecetaModel } from '../../modelos/receta.model';
import { RecetasService } from '../../servicios/recetas.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { ComentariosService } from '../../servicios/comentarios.service';
import { DenunciaService } from '../../servicios/denuncia.service';
import { ComentarioModel } from '../../modelos/comentario.model';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-receta',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './receta.component.html',
  styleUrls: ['./receta.component.css']
})
export class RecetaComponent implements OnInit {
  receta: RecetaModel = new RecetaModel(0, '', '', '', '', [], 0, [], [], 0, 0, '', []);
  listaRecetas: RecetaModel[] = [];
  addRecetaForm: FormGroup;
  comentarioForm: FormGroup;
  denunciaForm: FormGroup;
  idReceta: number = 0;
  sesion = false;
  mostrarFormularioRespuesta: boolean = false;
  respuestaForm: FormGroup;
  idComentario: number = 0;
  recetaEnLista = false;
  comentarioEnviado = false;
  respuestaEnviada = false;


  constructor(
    private formBuilder: FormBuilder,
    private _comentariosService: ComentariosService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private _recetasService: RecetasService,
    private _usuariosService: UsuariosService,
    private _autentificacionService: AutentificacionService,
    private _denunciaService: DenunciaService
  ) {
    this.addRecetaForm = this.fb.group({
      lista_id: ['', Validators.required]
    });

    this.comentarioForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      puntuacion: ['', Validators.required],
      complejidad: ['', Validators.required]
    });

    this.respuestaForm = this.formBuilder.group({
      descripcion: ['', Validators.required],
      comentario_id: [this.idComentario] 
    });

    this.denunciaForm = this.fb.group({
      motivo: ['', Validators.required],
      fecha: [new Date(), Validators.required],
      usuario_id: [this.obtenerUsuario(), Validators.required],
      receta_id: [this.obtenerIdReceta(), Validators.required],
    });
  }

  comprobarRecetaEnLista(): void {
    this.listaRecetas.forEach((receta: RecetaModel) => {
      if (receta.id === this.idReceta) {
        this.recetaEnLista = true;
      }else{
        this.recetaEnLista = false;
      }
    });
  }

  sesionIniciada(): boolean {
    return this._autentificacionService.isLogged();
  }

  obtenerIdReceta(): number {
    this.idReceta = this._route.snapshot.queryParams['id'];
    return this.idReceta;
  }

  ngOnInit(): void {
    this.idReceta = this._route.snapshot.queryParams['id'];
    this.obtenerListas();
    console.log(this.recetaEnLista);
    this.obtenerReceta();
    this.comprobarRecetaEnLista();

    

    if (this.sesionIniciada()) {
      this.sesion = true;
    }
    
  }

  obtenerReceta(){
    this._recetasService.getReceta(this.idReceta).subscribe(
      (data: RecetaModel) => {
        this.receta = data;
        console.log(this.receta);
      },
      (error) => {
        console.error('Error al obtener la receta:', error);
      }
    );

  }

  obtenerListas(): void {
    const idUsuario = parseInt(this._autentificacionService.getId());
    this._usuariosService.getListasUsuario(idUsuario).subscribe(
      (listas: RecetaModel[]) => {
        this.listaRecetas = listas;
        console.log(listas);
      },
      (error) => {
        console.error('Error al obtener las listas del usuario:', error);
      }
    );
  }
    
  agregarReceta(): void {
    const listaId = this.addRecetaForm.value.lista_id;
    const recetaId = this.receta.id;
    console.log(listaId);
    console.log(recetaId);

    this._recetasService.addRecetaToLista(listaId, recetaId).subscribe(
      (response: any) => {
        console.log('Receta añadida a la lista correctamente:', response);
        this.recetaEnLista = true;
      },
      (error: any) => {
        console.error('Error al añadir la receta a la lista:', error);
      }
    );
  }

  obtenerUsuario(): number {
    let id = parseInt(this._autentificacionService.getId());
    return id;
  }

  crearComentario(): void {
    const comentario: ComentarioModel = {
      id: 0,
      descripcion: this.comentarioForm.value.descripcion,
      usuario_id: this.obtenerUsuario(),
      complejidad: this.comentarioForm.value.complejidad,
      receta_id: this.idReceta,
      puntuacion: this.comentarioForm.value.puntuacion
    };

    console.log('Comentario a subir:', comentario);

    this._comentariosService.crearComentario(comentario).subscribe(
      (response: any) => {
        console.log('Comentario agregado correctamente:', response);
        this.comentarioEnviado = true;
        this.actualizarPuntuacionReceta();
        this.obtenerReceta();
      },
      (error: any) => {
        console.error('Error al agregar el comentario:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.comentarioForm.valid) {
      this.crearComentario();
    }
  }

  actualizarPuntuacionReceta(): void {
    this._comentariosService.getComentariosByRecetaId(this.idReceta).subscribe(
      (comentarios: ComentarioModel[]) => {
        const sumaPuntuaciones = comentarios.reduce((acc, comentario) => {
          if (comentario.puntuacion) {
            return acc + comentario.puntuacion;
          }
          return acc;
        }, 0);
        const mediaPuntuaciones = sumaPuntuaciones / comentarios.length;
        this._recetasService.updatePuntuacionReceta(this.idReceta, mediaPuntuaciones).subscribe(
          (response: any) => {
            console.log('Puntuación actualizada:', response);
            this.receta.puntuacion = mediaPuntuaciones;
          },
          (error: any) => {
            console.error('Error al actualizar la puntuación:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error al obtener los comentarios:', error);
      }
    );
  }

  toggleFormularioRespuesta(id: number): void {
    this.mostrarFormularioRespuesta = !this.mostrarFormularioRespuesta;
    this.idComentario = id;
  }

  crearRespuesta(): void {
    const comentario: ComentarioModel = {
      id: 0,
      descripcion: this.respuestaForm.value.descripcion,
      usuario_id: this.obtenerUsuario(),
      receta_id: this.idReceta,
      comentario_id: this.idComentario,
    };

    console.log('Respuesta a subir:', comentario);

    this._comentariosService.crearComentario(comentario).subscribe(
      (response: any) => {
        console.log('Respuesta agregada correctamente:', response);
        this.obtenerReceta();
        this.respuestaEnviada = true;

      },
      (error: any) => {
        console.error('Error al agregar la respuesta:', error);
      }
    );
  }

  onSubmitRespuesta(): void {
    if (this.respuestaForm.valid) {
      this.crearRespuesta();
    }
  }

  onSubmitDenuncia(): void {
    if (this.denunciaForm.valid) {
      this._denunciaService.denunciar(this.denunciaForm.value).subscribe(response => {
        console.log('Denuncia enviada:', response);
        this.denunciaForm.reset(); 
      }, (error: any) => {
        console.error('Error al enviar la denuncia:', error);
      });
    }
  }
}
