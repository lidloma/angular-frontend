import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'


//Librerías
import { RegistroComponent } from "../registro/registro.component";
import { InicioSesionComponent } from '../inicio-sesion/inicio-sesion.component';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { UsuarioModel } from '../../modelos/usuario.model';
import { CommonModule } from '@angular/common';



@Component({
    selector: 'app-navbar',
    standalone: true,
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    imports: [FormsModule, RegistroComponent, InicioSesionComponent, RouterModule, CommonModule]
})

export class NavbarComponent {
  ensenarInicioSesion: boolean = false;
  ensenarRegistro: boolean = false;
  sesionIniciada = false;
  usuario: UsuarioModel | undefined;

  consulta: string = '';

  constructor(private router: Router, private _autentificacion: AutentificacionService, private _usuariosService: UsuariosService) {}
  
  ngOnInit() {
    this.verificarSesion();
    this.datosUsuario();
  }

  verificarSesion() {
    this.sesionIniciada = this._autentificacion.isLogged();
    if (this.sesionIniciada) {
      this.sesionIniciada = true;
      console.log('Sesión iniciada');
    }
  }
  
  buscar() {
    if (this.consulta.trim() !== '') {
      this.router.navigate(['/buscador'], { queryParams: { q: this.consulta } });
    }
  }

  logout() {
    this._autentificacion.logout();
    this.sesionIniciada = false;
    console.log(this.sesionIniciada);
    window.location.reload();
  }


  datosUsuario() :void{
    if (this.sesionIniciada){
      let id = this._autentificacion.getId();
      this._usuariosService.getUsuarioId(id).subscribe((usuario: UsuarioModel) => {
        this.usuario = usuario;
        console.log(this.usuario);
        
      });

    }else{
        console.log('No hay usuario logueado');
      }
   
  }

  recargar(){
    window.location.reload();

  }



}