import { Component } from '@angular/core';
import { UsuarioModel } from '../../modelos/usuario.model';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { RecetaModel } from '../../modelos/receta.model';
import { HttpClientModule } from '@angular/common/http';
import { RecetasService } from '../../servicios/recetas.service';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  usuario: UsuarioModel = new UsuarioModel('', '', '', '', '', '', '', [], 0, []); 
  cont = 0;
  permiso = false;
  usuarioForm: FormGroup;
  usuarioId: number;
  imgUrl1 = '../../assets/imgs/fondoPredeterminado.jpg';
  imagenBase64: string | ArrayBuffer | null = null;
  sigueAlUsuario = false;
  sesionIniciada = false;

  constructor(
    private _route: ActivatedRoute,
    private _usuariosService: UsuariosService,
    private _autentificacionService: AutentificacionService,
    private _recetasService: RecetasService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      email: ['', Validators.email],
      nombre: [''],
      apellidos: [''],
      nombreUsuario: [''],
      provincia: [''],
      imagen: [''],
      contrasenia: [''],
    });
    this.usuarioId = parseInt(this._autentificacionService.getId());
  }
  
  ngOnInit(): void {
    this.comprobarPermiso();
    this.cargarDatosUsuario()
    this.comprobarSiSigue();
    this.verificarSesion();
    
    const idUsuario = this._route.snapshot.queryParams["id"];
    this._usuariosService.getUsuarioId(idUsuario).subscribe(
      (data: UsuarioModel) => {
        this.usuario = data;
      },
      (error) => {
        console.error('Error al obtener al usuario:', error); 
      }
    );
  }

  comprobarPermiso() {
    const idUsuario = this._route.snapshot.queryParams["id"];
    const id = this._autentificacionService.getId();
    if (idUsuario === id) {
      this.permiso = true;
    } else {
      this.permiso = false;
    }
  }

  comprobarSiSigue(): void {
    const seguidorId = parseInt(this._autentificacionService.getId());
    const idUsuario = parseInt(this._route.snapshot.queryParams["id"]);

    this._usuariosService.comprobarSiSigue(idUsuario, seguidorId).subscribe(
      (response: any) => {
        console.log('Comprobando si sigue al usuario:', response);
        
        if(response.sigue == "Sí"){
          this.sigueAlUsuario = true;
        }else{
          this.sigueAlUsuario = false;
        }        
        console.log(response ? 'Usuario seguido' : 'Usuario no seguido');
      },
      (error: any) => {
        console.error('Error comprobando si sigue al usuario:', error);
      }
    );
  }

  dejarDeSeguir(usuarioId:number): void {
    const seguidorId = parseInt(this._autentificacionService.getId(), 10);
    
  
    if (isNaN(seguidorId) || isNaN(usuarioId)) {
      console.error("Invalid user IDs.");
      return;
    }
  
    this._usuariosService.dejarDeSeguirUsuario(usuarioId, seguidorId).subscribe(
      response => {
        console.log(response.message);
        const idUsuario = this._route.snapshot.queryParams["id"];

        this.sigueAlUsuario = false;
        this._usuariosService.getUsuarioId(idUsuario).subscribe(
          (data: UsuarioModel) => {
            this.usuario = data;
          },
          (error) => {
            console.error('Error al obtener al usuario:', error); 
          }
        );
      },
      error => {
        console.error("Error occurred while unfollowing the user:", error.message);
      }
    );
  }

  seguirUsuario(): void {
    const seguidorId = parseInt(this._autentificacionService.getId());
    const usuarioId = parseInt(this._route.snapshot.queryParams["id"]);

    this._usuariosService.seguirUsuario(usuarioId, seguidorId).subscribe(
      response => {
        this.sigueAlUsuario = true;

        console.log(response.message);  
      },
      error => {
        console.error(error.message);  // "Usuario no encontrado" u otros errores
      }
    );
  }

  eliminarReceta(id: number): void {
    this._recetasService.eliminarReceta(id).subscribe((response: any) => {
      console.log('Receta eliminada:', response);
      const idUsuario = this._route.snapshot.queryParams["id"];

      this._usuariosService.getUsuarioId(idUsuario).subscribe(
        (data: UsuarioModel) => {
          this.usuario = data;
        },
        (error) => {
          console.error('Error al obtener al usuario:', error); 
        }
      
      );
      window.location.reload();


    }, (error: any) => {
      console.error('Error eliminando receta:', error);
    });
  }

  actualizarUsuario(): void {
    if (this.usuarioForm.valid) {
      const usuario: UsuarioModel = { ...this.usuarioForm.value, imagen: this.imagenBase64 };
      
      this._usuariosService.actualizarUsuario(this.usuarioId, usuario).subscribe(
        (response: UsuarioModel) => {
          console.log('Usuario actualizado:', response);
        },
        (error: any) => {
          alert('Error al actualizar el usuario');
        }
      );
    }
  }


  cargarDatosUsuario(): void {
    const usuarioId = this._autentificacionService.getId();
    this._usuariosService.getUsuarioId(usuarioId).subscribe(
      (data: any) => {
        this.usuarioForm.patchValue({
          email: data.email,
          nombre: data.nombre,
          apellidos: data.apellidos,
          nombreUsuario: data.nombreUsuario,
          provincia: data.provincia,
          contrasenia: data.contrasenia,
          imagen: data.imagen
        });
      },
      (error:any) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  seleccionarImagen(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        this.imagenBase64 = base64Data;
        this.usuarioForm.patchValue({ imagen: this.imagenBase64 });
      };
      reader.readAsDataURL(file);
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

}
