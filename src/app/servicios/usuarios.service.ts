import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../modelos/usuario.model';
import { Observable } from 'rxjs';
import { RecetaModel } from '../modelos/receta.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private _http:HttpClient){}
  
  crearUsuario(userdata: UsuarioModel) {
    const body = {
      email: userdata.email,
      nombre: userdata.nombre,
      apellidos: userdata.apellidos,
      imagen: userdata.imagen,
      contrasenia: userdata.contrasenia,
      nombreUsuario: userdata.nombreUsuario,
      provincia: userdata.provincia,
      roles: userdata.roles,
      categorias: userdata.categorias
    };
  
    return this._http.post('http://127.0.0.1:8001/api/usuarios/registro', body);
  }

  obtenerImagenPerfil(email:string){
    const body = { email };
    return this._http.post<string>('http://127.0.0.1:8001/api/usuario/imagen', body);
  }

  getUsuario(email:string){
    const body = { email };
    return this._http.post<UsuarioModel>('http://127.0.0.1:8001/api/usuarios/email', body);
  }

  getUsuarioId(id:string){
    return this._http.get<UsuarioModel>(`http://127.0.0.1:8001/api/usuarios/${id}`);
  }

  getListaUsuarios(): Observable<UsuarioModel[]> {
    return this._http.get<UsuarioModel[]>('http://127.0.0.1:8001/api/usuarios');
  }

  getRecetasCategoriaUsuario(id:string): Observable<RecetaModel[]> {
    return this._http.get<RecetaModel[]>(`http://127.0.0.1:8001/api/usuarios/categorias_receta_usuario/${id}`);
  }

  getListasUsuario(id:number): Observable<RecetaModel[]>{
    return this._http.get<RecetaModel[]>(`http://127.0.0.1:8001/api/lista/${id}`)
  }

  seguirUsuario(id: number, seguidorId: number): Observable<any> {
    const url = `http://127.0.0.1:8001/api/usuarios/${id}/seguir`;
    const body = { seguidor_id: seguidorId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>(url, body, { headers });
  }

  actualizarUsuario(id: number, usuario: UsuarioModel): Observable<UsuarioModel> {
    return this._http.put<UsuarioModel>(`http://127.0.0.1:8001/api/usuarios/${id}`, usuario);
  }

  dejarDeSeguirUsuario(usuarioId: number, seguidorId: number): Observable<any> {
    const body = { usuario_id: usuarioId, seguidor_id: seguidorId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<any>('http://127.0.0.1:8001/api/usuarios/dejar-de-seguir', body, { headers });
  }

  comprobarSiSigue(usuarioId: number, seguidorId: number): Observable<boolean> {
    const url = `http://127.0.0.1:8001/api/usuarios/comprobar-si-sigue`;
    const body = { seguidor_id: seguidorId, usuario_id: usuarioId};
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post<boolean>(url, body, { headers });
  }

}
