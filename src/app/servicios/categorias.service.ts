import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoriaModel } from '../modelos/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private _http: HttpClient) { }

  getCategorias(): Observable<CategoriaModel[]> {
    return this._http.get<CategoriaModel[]>('http://127.0.0.1:8001/api/categorias');
  }

  actualizarCategoriasUsuario(userId: number, categorias: number[]): Observable<any> {
    return this._http.put(`http://127.0.0.1:8001/api/categorias/${userId}/actualizar`, { categorias });
  }
}
