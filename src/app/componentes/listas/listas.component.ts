import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../modelos/usuario.model';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { HttpClientModule } from '@angular/common/http';
import { RecetasService } from '../../servicios/recetas.service';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListaModel } from '../../modelos/lista.model';
import { CommonModule } from '@angular/common';
import { RecetaModel } from '../../modelos/receta.model';

@Component({
  selector: 'app-listas',
  standalone: true,
  imports: [RouterModule, HttpClientModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel('', '', '', '', '', '', '', [], 0, []); 
  cont = 0;
  permiso = false;
  listaRecetas: RecetaModel[] = [];
  listaForm: FormGroup;
  editListaForm: FormGroup;

  listaId = 0;

  imagenBase64: string | ArrayBuffer | null = null;
  imagenBase64Edit: string | ArrayBuffer | null = null;
  listaSeleccionada: ListaModel | null = null;

  constructor(
    private _route: ActivatedRoute, 
    private _usuariosService: UsuariosService, 
    private _autentificacionService: AutentificacionService, 
    private fb: FormBuilder,
    private _recetasService: RecetasService
  ) {
    this.listaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required]
    });  
    this.editListaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagen: ['', Validators.required]
    });  
  }

  ngOnInit(): void {
    this.comprobarPermiso();
    this.obtenerListas();
    const idUsuario = this._route.snapshot.queryParams["id"];
    this._usuariosService.getUsuarioId(idUsuario).subscribe(
      (data: UsuarioModel) => {
        this.usuario = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener al usuario:', error); 
      }
    );
  }

  comprobarPermiso() {
    const idUsuario = this._route.snapshot.queryParams["id"];
    const id = this._autentificacionService.getId();
    this.permiso = idUsuario === id;
  }

  obtenerListas() {
    const idUsuario = parseInt(this._route.snapshot.queryParams["id"]);
    console.log(idUsuario);
    
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

  obtenerId(): number {
    return parseInt(this._autentificacionService.getId());
  }

  subirLista(): void {
    if (this.listaForm.valid) {
      const listaData: ListaModel = { usuario_id: this.obtenerId(), ...this.listaForm.value, imagen: this.imagenBase64 };
      console.log('Lista a subir:', listaData);

      this._recetasService.crearLista(listaData).subscribe(
        (response: any) => {
          console.log('Lista creada correctamente:', response);
          this.obtenerListas(); 
          this.listaForm.reset(); 
        },
        (error: any) => {
          console.error('Error al crear la lista:', error);
        }
      );
    }
  }

  seleccionarImagen(event: any, type: 'new' | 'edit' = 'new'): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        if (type === 'new') {
          this.imagenBase64 = base64Data;
          this.listaForm.patchValue({ imagen: this.imagenBase64 });
        } else {
          this.imagenBase64Edit = base64Data;
          this.editListaForm.patchValue({ imagen: this.imagenBase64Edit });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarReceta(listaId: number, recetaId: number): void {
    this._recetasService.eliminarRecetaDeLista(listaId, recetaId).subscribe(
      response => {
        console.log(response.message);
        this.obtenerListas();
      },
      error => {
        console.error('Error al eliminar la receta:', error);
      }
    );
  }

  eliminarLista(listaId: number): void {
    
    this._recetasService.eliminareLista(listaId).subscribe(
      (response:any) => {
        console.log(response.message);
        this.obtenerListas();
      },
      (error:any) => {
        console.error('Error al eliminar la lista:', error);
      }
    );
  }

  editarLista(nombre:string, descripcion:string, imagen:string, id:number): void {
    this.listaSeleccionada = { nombre, descripcion, imagen} as ListaModel;
    this.listaId = id;
    this.editListaForm.patchValue({
      nombre: nombre,
      descripcion: descripcion,
      imagen: imagen
    });
    
    this.imagenBase64Edit = imagen;
  }

  actualizarLista(): void {
    if (this.editListaForm.valid && this.listaSeleccionada) {
      const updatedLista: ListaModel = { 
        ...this.listaSeleccionada, 
        ...this.editListaForm.value, 
        imagen: this.imagenBase64Edit 
      };
      console.log('Lista a actualizar:', updatedLista);

      this._recetasService.editarLista(this.listaId, updatedLista).subscribe(
        (response: any) => {
          console.log('Lista actualizada correctamente:', response);
          this.obtenerListas();
          this.editListaForm.reset();
          this.listaSeleccionada = null;
        },
        (error: any) => {
          console.error('Error al actualizar la lista:', error);
        }
      );
    }
  }
}
