import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaModel } from '../../modelos/categoria.model';
import { UsuarioModel } from '../../modelos/usuario.model';
import { UsuariosService } from '../../servicios/usuarios.service';
import { CategoriasService } from '../../servicios/categorias.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { RecetaModel } from '../../modelos/receta.model';
import { IngredienteModel } from '../../modelos/ingrediente.model';
import { IngredientesService } from '../../servicios/ingredientes.service';
import { DropdownModule } from 'primeng/dropdown';
import { PasoModel } from '../../modelos/paso.model';
import { RecetasService } from '../../servicios/recetas.service';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { PasoService } from '../../servicios/paso.service';

@Component({
  selector: 'app-receta-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MultiSelectModule, DropdownModule],
  templateUrl: './receta-form.component.html',
  styleUrls: ['./receta-form.component.css']
})
export class RecetaFormComponent implements OnInit {
  crearReceta: FormGroup;
  receta: RecetaModel[] = [];
  imgUrl1 = '../../assets/imgs/fondoPredeterminado.jpg';
  imgUrl2 = '';
  imgSrc3: string[] = [];
  categoriasLista: CategoriaModel[] = [];
  ingredientesLista: IngredienteModel[] = [];
  unidadesMostrar: string[] = [];
  usuario: UsuarioModel | undefined;
  imagenBase641: string | ArrayBuffer | null = null;
  imagenBase642: string | ArrayBuffer | null = null;
  recetaCreada = false;


  constructor(
    private fb: FormBuilder,
    private _recetasService: RecetasService,
    private _usuariosService: UsuariosService,
    private _categoriasService: CategoriasService,
    private _ingredientesService: IngredientesService,
    private _autentificacionService: AutentificacionService,
    private _pasosService: PasoService
  ) {
    this.crearReceta = this.fb.group({
      tiempo: [0, [Validators.required]],
      descripcion: ['', Validators.required],
      estado: [false],
      fecha: new Date(),
      nombre: ['', Validators.required],
      categorias: [[], Validators.required],
      pasos: this.fb.array([]),
      ingredientes: this.fb.array([]),
      usuario: [''],
      numeroPersonas: [0, Validators.required],
      complejidad: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.listaCategorias();
    this.unidadesMostrar = ['g', 'kg', 'ml', 'l', 'cucharada', 'cucharadita', 'taza', 'unidad'];
  }

  arrayImagenes(): { imagen: string }[] {
    const arrayImagen: { imagen: string }[] = [];
    if (this.imagenBase641) arrayImagen.push({ imagen: this.imagenBase641.toString() });
    if (this.imagenBase642) arrayImagen.push({ imagen: this.imagenBase642.toString() });
    return arrayImagen;
  }

  obtenerUsuario(): number {    
    return parseInt(this._autentificacionService.getId());
  }

  obtenerIdCategorias(): number[] {
    return this.crearReceta.value.categorias.map((categoria: CategoriaModel) => categoria.id);
  }

  subirReceta(): void {
    const recetaData: RecetaModel = {
      id: 0,
      tiempo: this.crearReceta.value.tiempo,
      descripcion: this.crearReceta.value.descripcion,
      estado: "público",
      fecha: this.obtenerFechaActualString(),
      nombre: this.crearReceta.value.nombre,
      categoriasId: this.obtenerIdCategorias(),
      paso: this.crearReceta.value.pasos,
      imagenUrl: this.arrayImagenes(),
      ingrediente: this.crearReceta.value.ingredientes,
      usuarioId: this.obtenerUsuario(),
      numeroPersonas: this.crearReceta.value.numeroPersonas,
      complejidad: this.crearReceta.value.complejidad
    };

    this._recetasService.crearReceta(recetaData).subscribe(
      response => {
        console.log('Receta agregada correctamente:', response);
        this.recetaCreada = true;
      },
      error => {
        console.error('Error al agregar receta:', error);
      }
    );
  }

  get ingredientes(): FormArray {
    return this.crearReceta.get('ingredientes') as FormArray;
  }

  agregarIngrediente() {
    const ingredienteForm = this.fb.group({
      cantidad: ['', Validators.required],
      unidad: ['', Validators.required],
      nombre: ['', Validators.required]
    });

    this.ingredientes.push(ingredienteForm);
  }

  eliminarIngrediente(index: number) {
    this.ingredientes.removeAt(index);
  }

  get pasos(): FormArray {
    return this.crearReceta.get('pasos') as FormArray;
  }

  agregarPaso() {
    const pasoForm = this.fb.group({
      descripcion: ['', Validators.required],
      numero: ['', Validators.required],
      imagen: ['']
    });

    this.pasos.push(pasoForm);
  }

  eliminarPaso(index: number) {
    this.pasos.removeAt(index);
  }

  listaCategorias() {
    this._categoriasService.getCategorias().subscribe(
      (data: CategoriaModel[]) => {
        this.categoriasLista = data;
      },
      error => {
        console.error('Error al obtener la lista de categorías:', error);
      }
    );
  }

  onFileChange1(event: any) {
    this.handleFileInput(event, 1);
  }

  onFileChange2(event: any) {
    this.handleFileInput(event, 2);
  }

  onPasoFileChange(event: any, index: number) {
    this.handlePasoFileInput(event, index);
  }

  handleFileInput(event: any, index: number) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];
        if (index === 1) {
          this.imagenBase641 = base64Data;
          this.imgUrl1 = e.target.result; // Update image URL for preview
        } else if (index === 2) {
          this.imagenBase642 = base64Data;
          this.imgUrl2 = e.target.result; // Update image URL for preview
        }
      };
      reader.readAsDataURL(file);
    }
  }

  handlePasoFileInput(event: any, index: number) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];
        const pasosArray = this.pasos;
        const pasoControl = pasosArray.at(index) as FormGroup;
        pasoControl.patchValue({ imagen: base64Data });
      };
      reader.readAsDataURL(file);
    }
  }

  obtenerFechaActualString(): string {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const año = fechaActual.getFullYear();

    return `${dia}-${mes}-${año}`;
  }
  onSubmit(): void {
    if (this.crearReceta.valid) {
      this.subirReceta();
      console.log('Formulario válido:', this.crearReceta.value);
    } else {
      console.log('Formulario inválido');
      this.crearReceta.markAllAsTouched();

    }
  }
}
