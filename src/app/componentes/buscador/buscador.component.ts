import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecetaModel } from '../../modelos/receta.model';
import { CategoriaModel } from '../../modelos/categoria.model';
import { RecetasService } from '../../servicios/recetas.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AutentificacionService } from '../../servicios/autentificacion.service';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [ HttpClientModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  consulta: string = '';
  recetas: RecetaModel[] = [];
  cont = 0;
  categoriasForm: FormGroup;
  listaCategorias: CategoriaModel[] = [];
  buscador = false;
  addRecetaForm: FormGroup;
  listaRecetas: RecetaModel[] = []
  recetaEnLista = false;
  sesionIniciada = false;

  

  constructor(private fb: FormBuilder,
    private _recetaService: RecetasService, 
    private route: ActivatedRoute,
    private _autentificacionService:AutentificacionService,
    private _usuarioService:UsuariosService
  ){
    this.categoriasForm = this.fb.group({
      categoria: ['']
    });
    this.addRecetaForm = this.fb.group({
      lista_id: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.verificarSesion();
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.consulta = params['q'];
        this.filtrarRecetas();
      } else {
        this.obtenerTodasRecetas();
        this.buscador = true;
        
      }
    });
    if(this.sesionIniciada){
      this.obtenerListas();
      this.getListaCategorias();
    }
    
  }

  verificarSesion() {
    const usuario = this._autentificacionService.getEmail();
    if (usuario) {
      this.sesionIniciada = true;
      console.log('Sesión iniciada');
      
    } else {
      this.sesionIniciada = false;

      console.log('No hay sesión iniciada');
    }
  }

  
  obtenerListas(): void {
    const idUsuario = parseInt(this._autentificacionService.getId());
    this._usuarioService.getListasUsuario(idUsuario).subscribe(
      (listas: RecetaModel[]) => {
        this.listaRecetas = listas;
      },
      (error:any) => {
        console.error('Error al obtener las listas del usuario:', error);
      }
    );
  }

  getListaCategorias() {
    this._recetaService.getCategorias().subscribe(
      (data: CategoriaModel[]) => {
        this.listaCategorias = data;
      },
      (error) => {
        console.error('Error al obtener la lista de categorias:', error);
      }
    );
  }

  filtrarRecetas() {
    if (this.consulta.trim() !== '') {
      this._recetaService.buscarReceta(this.consulta).subscribe(
        (data: RecetaModel[]) => {
          this.recetas = data;
          this.cont = this.recetas.length;
        },
        (error) => {
          console.error('Error al filtrar recetas:', error);
          this.recetas = [];
        }
      );
    }
  }

  obtenerTodasRecetas() {
    this._recetaService.getRecetas().subscribe(
      (data: RecetaModel[]) => {
        this.recetas = data;
        
      },
      (error) => {
        console.error('Error al obtener todas las recetas:', error);
        this.recetas = [];
      }
    );
  }

  onSubmit(): void {
    const categoria = this.categoriasForm.get('categoria')?.value;
    this._recetaService.getRecetasPorCategoria(categoria).subscribe(
      (data: RecetaModel[]) => {
        this.recetas = data;
      },
      (error) => {
        console.error('Error al obtener recetas por categoría', error);
      }
    );
  }

  
  agregarReceta(recetaId:number): void {
    const listaId = this.addRecetaForm.value.lista_id;

    this._recetaService.addRecetaToLista(listaId, recetaId).subscribe(
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
