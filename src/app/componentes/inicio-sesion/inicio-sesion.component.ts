import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutentificacionService } from '../../servicios/autentificacion.service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  loginForm: FormGroup;
  isLoggedIn = false;
  errores: string[] = [];
  errorBoolean = false;

  constructor(
    private autentificacion: AutentificacionService,
    private fb: FormBuilder,
    private _router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', Validators.required]
    });
  }

  iniciarSesion() {
    this.errores = [];
    this.errorBoolean = false;

    if (this.loginForm.invalid) {
      if (this.loginForm.value.email === '' && (!(this.loginForm.value.contrasenia === ''))) {
        this.loginForm.controls['email'].setErrors({ 'incorrect': true });
        this.errores.push('El campo de correo electrónico no puede estar vacío');
        this.errorBoolean = true;
      }

      if (this.loginForm.value.contrasenia === '' && (!(this.loginForm.value.email === ''))) {
        this.loginForm.controls['contrasenia'].setErrors({ 'incorrect': true });
        this.errores.push('El campo de contraseña no puede estar vacío');
        this.errorBoolean = true;
      }

      if (!this.loginForm.value.email.includes('@') || !this.loginForm.value.email.includes('.')) {
        this.loginForm.controls['email'].setErrors({ 'incorrect': true });
        this.errores.push('El correo electrónico debe tener un formato válido');
        this.errorBoolean = true;
      }

      if (this.loginForm.value.email === '' && this.loginForm.value.contrasenia === '') {
        this.loginForm.controls['email'].setErrors({ 'incorrect': true });
        this.errores.push('Los campos de correo electrónico y contraseña no pueden estar vacíos');
        this.errorBoolean = true;
      }

      if (this.errorBoolean) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.errores.join(', ') });
        return;
      }
    }

    let loginEmail: string = this.loginForm.value.email;
    let loginPassword: string = this.loginForm.value.contrasenia;

    this.autentificacion.login(loginEmail, loginPassword).subscribe(
      (result: boolean) => {
        if (result) {
          this.isLoggedIn = true;
          console.log('Usuario autenticado');
          let route: string = '/inicio';
          let rol = this.autentificacion.getRol();

          if (rol === 'administrador') {
            route = '/admin';
          }
          this._router.navigate([route]);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          this.loginForm.controls['email'].setErrors({ 'incorrect': true });
          this.loginForm.controls['contrasenia'].setErrors({ 'incorrect': true });
          this.errores.push('Verifica que la contraseña y el correo electrónico sean correctos');
          this.errorBoolean = true;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Revisa tus credenciales' });
          console.log(this.errores);
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.loginForm.controls['contrasenia'].setErrors({ 'incorrect': true });
        this.errores.push('Contraseña no válida');
        this.errorBoolean = true;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Contraseña no válida' });
      }
    );
  }
}
