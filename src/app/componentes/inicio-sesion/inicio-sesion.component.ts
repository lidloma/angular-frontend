import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';


import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  loginForm: FormGroup;
  isLoggedIn = false;
  errores: string[] = [];
  errorBoolean = false;
  constructor(
    private autentificacion: AutentificacionService,
    private fb: FormBuilder,
    private _router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required]
    });
  }
  iniciarSesion() {
    this.errores = []
    this.errorBoolean = false;

    if (this.loginForm.invalid) {
      if(this.loginForm.value.email === '' && (!(this.loginForm.value.contrasenia === ''))){
        this.loginForm.controls['email'].setErrors({'incorrect': true});
        this.errores.push('El campo de correo electrónico no puede estar vacío');
        this.errorBoolean = true;
      }

      if(this.loginForm.value.contrasenia === '' && (!(this.loginForm.value.email === ''))){
        this.loginForm.controls['contrasenia'].setErrors({'incorrect': true});
        this.errores.push('El campo de contraseña no puede estar vacío');
        this.errorBoolean = true;
      }

      if(!this.loginForm.value.email.includes('@') || !this.loginForm.value.email.includes('.')){
        this.loginForm.controls['email'].setErrors({'incorrect': true});
        this.errores.push('El correo electrónico debe tener un formato válido');
        this.errorBoolean = true;
      }

      if(this.loginForm.value.email === '' && this.loginForm.value.contrasenia === ''){
        this.loginForm.controls['email'].setErrors({'incorrect': true});
        this.errores.push('Los campos de correo electrónico y contraseña no pueden estar vacíos');
        this.errorBoolean = true;
      }

    }

    let loginEmail: string = this.loginForm.value.email;
    let loginPassword: string = this.loginForm.value.contrasenia;

    this.autentificacion.login(loginEmail, loginPassword).subscribe({
      next: (result: Boolean) => {
        if (result) {
          this.isLoggedIn = true;
          console.log('Usuario autenticado');
          let route: string = '/inicio';
          let rol = this.autentificacion.getRol();
          console.log(rol);
          
          if (rol === 'administrador') {
            route = '/admin';
          }
          this._router.navigate([route]);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        
        } else {
          this.loginForm.controls['email'].setErrors({'incorrect': true});
          this.loginForm.controls['contrasenia'].setErrors({'incorrect': true});
          this.errores.push('Verifica que la contraseña y el correo electrónico sean correctos');
          this.errorBoolean = true;
        }
      },
      error: console.log
    });
  }
  
}

