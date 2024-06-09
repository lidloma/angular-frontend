
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaModel } from '../../modelos/categoria.model';
import { UsuarioModel } from '../../modelos/usuario.model';
import { UsuariosService } from '../../servicios/usuarios.service';
import { CategoriasService } from '../../servicios/categorias.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { Router } from '@angular/router';
import { AutentificacionService } from '../../servicios/autentificacion.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MultiSelectModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  @ViewChild('registroModal') registroModal: any;

  datos = false;
  registroForm: FormGroup;
  usuarios: UsuarioModel[] = [];
  errores: string[] = [];
  error = false;
  categorias: CategoriaModel[] = [];
  registroExitoso = false;

  constructor(private fb: FormBuilder, 
    private _usuariosService: UsuariosService, 
    private _categoriasService: CategoriasService,
    private _router: Router,
    private _autentificacionService: AutentificacionService
  ) {

    this.listaCategorias();
    this.loadDefaultImage();
    this.registroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      apellidos: ['', Validators.required],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      repetirContrasenia: ['', Validators.required],
      imagen: ['', Validators.required],
      roles: [['usuario'], Validators.required],
      provincia: ['', Validators.required],
      categorias: ['', this.minSelectedCheck(3)],
      aceptarTerminos: [false, Validators.requiredTrue]
    });
  }

  comprobarContrasenia() {
    if (this.registroForm.value.contrasenia === this.registroForm.value.repetirContrasenia) {
      return true;
    } else {
      this.errores.push("Las contraseñas no coinciden");
      this.error = false;
      return false;
    }
  }

  comprobarEmail(): void {
    this._usuariosService.getListaUsuarios().subscribe(
      (data: UsuarioModel[]) => {
        const emailIngresado = this.registroForm.value.email;
        const usuarioExistente = data.find(usuario => usuario.email === emailIngresado);
        if (usuarioExistente) {
          this.errores.push("El email ya está registrado");
          this.error = true;
        } else {
          this.registrarse();
        }
      },
      (error) => {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    );
  }

  registrarse(): void {
    const formValues = this.registroForm.value;
    console.log(formValues.imagen);
    
    const userData: UsuarioModel = {
      id: 0,
      email: formValues.email,
      nombre: formValues.nombre,
      apellidos: formValues.apellidos,
      contrasenia: formValues.contrasenia,
      imagen: formValues.imagen,
      nombreUsuario: formValues.nombreUsuario,
      roles: formValues.roles,
      provincia: formValues.provincia,
      categorias: formValues.categorias
    };

    this._usuariosService.crearUsuario(userData).subscribe(
      (response: any) => {
        this.registroExitoso = true; 
        console.log('Usuario agregado correctamente:', response);
        setTimeout(() => {
          window.location.reload();

        }, 2000);
        this.iniciarSesion();
      
      },
      (error: any) => {
        console.error('Error al agregar usuario:', error);
      }
    );
  }

  iniciarSesion(){
    const formValues = this.registroForm.value;

    this._autentificacionService.login(formValues.email, formValues.contrasenia).subscribe({
      next: (result: Boolean) => {
        if (result) {
          let route: string = '/inicio';
          let rol = this._autentificacionService.getRol();
          if (rol === 'administrador') {
            route = '/admin';
          }

          this._router.navigate([route]);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        
        } else{
          console.log("No se puede iniciar sesión");
          
        }
      },
      error: console.log
    });
  
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      if (this.comprobarContrasenia()) {
        this.comprobarEmail();
      }
    } else {
      this.errores = [];
      this.errores.push("Por favor, rellene todos los campos");
      this.error = true;
    }
  }

  minSelectedCheck(min = 3) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        return control.value.length >= min ? null : { 'minSelected': { value: control.value.length } };
      }
      return { 'minSelected': { value: 0 } };
    };
  }

  listaCategorias() {
    this._categoriasService.getCategorias().subscribe(
      (data: CategoriaModel[]) => {
        this.categorias = data;
      },
      (error) => {
        console.error('Error al obtener la lista de categorías:', error);
      }
    );
  }

  loadDefaultImage(): void {
    const defaultImagePath = '../../../assets/imgs/default-user.png'; 
    fetch(defaultImagePath)
      .then(response => response.blob())
      .then(blob => {
        const file = new File([blob], 'default-user.png', { type: blob.type });
        this.convertToBase64(file).then(base64 => {
          this.registroForm.patchValue({ imagen: base64 });
        });
      })
      .catch(error => {
        console.error('Error loading default image:', error);
      });
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).replace(/^data:image\/[a-z]+;base64,/, '');
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.convertToBase64(file).then(base64 => {
        this.registroForm.patchValue({ imagen: base64 });
      });
    }
  }
}

