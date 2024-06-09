import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComentarioModel } from '../modelos/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  constructor(private _http: HttpClient) { }
  crearComentario(comentarioData: any): Observable<any> {
    const body: any = {
      receta_id: comentarioData.receta_id,
      usuario_id: comentarioData.usuario_id
    };

    if (comentarioData.descripcion !== null) {
      body.descripcion = comentarioData.descripcion;
    }
    if (comentarioData.complejidad !== null) {
      body.complejidad = comentarioData.complejidad;
    }
    if (comentarioData.puntuacion !== null) {
      body.puntuacion = comentarioData.puntuacion;
    }
    if (comentarioData.nombreUsuario !== null) {
      body.nombreUsuario = comentarioData.nombreUsuario;
    }
    if (comentarioData.comentario_id !== null) {
      body.comentario_id = comentarioData.comentario_id;
    }

    return this._http.post(`http://127.0.0.1:8001/api/comentarios/crear`, body);
  }


  getComentariosByRecetaId(recetaId: number): Observable<ComentarioModel[]> {
    return this._http.get<ComentarioModel[]>(`http://127.0.0.1:8001/api/comentarios/receta/${recetaId}`);
  }
}
