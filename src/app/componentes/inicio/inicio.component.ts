import { Component, OnInit } from '@angular/core';
import { RecetasService } from '../../servicios/recetas.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { UsuarioModel } from '../../modelos/usuario.model';
import { RouterLink, RouterModule } from '@angular/router';
import { RecetaModel } from '../../modelos/receta.model';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { CategoriaModel } from '../../modelos/categoria.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { CategoriasService } from '../../servicios/categorias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  sesionIniciada = false;
  recetas: RecetaModel[] = [];
  categorias: CategoriaModel[] = [];
  listaCategorias: CategoriaModel[] = [];
  usuario: UsuarioModel | undefined;
  categoriasForm: FormGroup;
  categoriasUsuario: CategoriaModel[] = [];
  recetasUsuarioSeguidos: RecetaModel[] = [];
  cargandoUsuario: boolean = true;
  recetaEnLista = false;
  addRecetaForm: FormGroup;
  listaRecetas:RecetaModel[] = [];



  //Si el usuario no inicia sesión
  recetasMasRecientes: RecetaModel[] = [];
  recetasMejorPuntuadas: RecetaModel[] = [];

  constructor(
    private fb: FormBuilder,
    private _autentificacion: AutentificacionService,
    private _usuarioService: UsuariosService,
    private _recetasService: RecetasService,
    private _categoriasService: CategoriasService
  ) {
    this.categoriasForm = this.fb.group({
      categorias: this.fb.array([])
    });
    this.addRecetaForm = this.fb.group({
      lista_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.verificarSesion();
    if (this.sesionIniciada) {
      this.verCategorias();
      this.datosUsuario();
      this.categoriasRandom();
      this.getListaCategorias();
      this.obtenerListas();
    }
  }

  obtenerListas(): void {
    const idUsuario = parseInt(this._autentificacion.getId());
    this._usuarioService.getListasUsuario(idUsuario).subscribe(
      (listas: RecetaModel[]) => {
        this.listaRecetas = listas;
      },
      (error:any) => {
        console.error('Error al obtener las listas del usuario:', error);
      }
    );
  }

  verificarSesion() {
    const usuario = this._autentificacion.getEmail();
    if (usuario) {
      this.sesionIniciada = true;
      this.cargandoUsuario = true;
      console.log('Sesión iniciada');
      
    } else {
      this.sesionIniciada = false;
      this.cargandoUsuario = false;

      console.log('No hay sesión iniciada');
    }
  }

  verCategorias() {
    const id = this._autentificacion.getId();
    this._usuarioService.getRecetasCategoriaUsuario(id).subscribe(
      (data: RecetaModel[]) => {
        this.recetas = data;
      },
      (error) => {
        console.error('Error al obtener la lista de recetas:', error);
      }
    );
  }

  

  datosUsuario(): void {
    if (this.sesionIniciada) {
      let id = this._autentificacion.getId();
      this._usuarioService.getUsuarioId(id).subscribe((usuario: UsuarioModel) => {
        this.usuario = usuario;
        this.cargandoUsuario = false;

        this.categoriasUsuario = usuario.categorias;
        this.setCategoriasUsuario();

        this.recetasUsuarioSeguidos = [];
        this.getRecetasUsuarioSeguidos();
      });
    } else {
      this.cargandoUsuario = false;
    }
  }

  getListaCategorias() {
    this._recetasService.getCategorias().subscribe(
      (data: CategoriaModel[]) => {
        this.listaCategorias = data;
        this.setCategoriasCheckboxes();
      },
      (error:any) => {
        console.error('Error al obtener la lista de categorias:', error);
      }
    );
  }

  getRecetasUsuarioSeguidos() {
    const usuarios = this.usuario?.usuarios; // Lista de UsuarioModel con todos los usuarios que sigue el usuario
    if (!usuarios) {
      console.log('No hay usuarios seguidos');
      return;
    }
    for (const usuario of usuarios) {
      if (usuario.recetas) {
        this.recetasUsuarioSeguidos.push(...usuario.recetas);
      }
    }
  }

  setCategoriasCheckboxes(): void {
    const categoriasFormArray = this.categoriasForm.controls['categorias'] as FormArray;
    this.listaCategorias.forEach(() => categoriasFormArray.push(this.fb.control(false)));
    if (this.categoriasUsuario.length > 0) {
      this.setCategoriasUsuario();
    }
  }

  setCategoriasUsuario(): void {
    const categoriasFormArray = this.categoriasForm.controls['categorias'] as FormArray;
    this.listaCategorias.forEach((categoria, index) => {
      if (this.categoriasUsuario.find(cat => cat.id === categoria.id)) {
        categoriasFormArray.at(index).setValue(true);
      }
    });
  }

  onSubmit(): void {
    const selectedCategorias = this.categoriasForm.value.categorias
      .map((checked: boolean, i: number) => checked ? this.listaCategorias[i].id : null)
      .filter((v: any) => v !== null);

    const id = parseInt(this._autentificacion.getId(), 10);
    this._categoriasService.actualizarCategoriasUsuario(id, selectedCategorias).subscribe(
      (response) => {
        console.log('Categorías actualizadas exitosamente', response);
        this.datosUsuario();
        window.location.reload();
      },
      (error) => {
        console.error('Error al actualizar las categorías:', error);
      }
    );
  }

  categoriasRandom() {
    this._recetasService.getCategorias().subscribe(
      (data: CategoriaModel[]) => {
        this.categorias = [];
        for (let i = 0; i < 3; i++) {
          let randomIndex = Math.floor(Math.random() * data.length);
          this.categorias.push(data[randomIndex]);
          data.splice(randomIndex, 1); // Remove the selected item from the data array
        }
      },
      (error) => {
        console.error('Error al obtener la lista de categorias:', error);
      }
    );
  }



  agregarReceta(recetaId:number): void {
    const listaId = this.addRecetaForm.value.lista_id;

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
}
