import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecetaModel } from '../modelos/receta.model';
import { CategoriaModel } from '../modelos/categoria.model';
import { ListaModel } from '../modelos/lista.model';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  constructor(private _http: HttpClient) { }

  getRecetas(): Observable<RecetaModel[]> {
    return this._http.get<RecetaModel[]>('http://127.0.0.1:8001/api/recetas');
  }

  getMejorPuntuadas(): Observable<RecetaModel[]> {
    return this._http.get<RecetaModel[]>('http://127.0.0.1:8001/api/recetas/mejor-puntuadas');
  }

  getMasRecientes(): Observable<RecetaModel[]> {
    return this._http.get<RecetaModel[]>('http://127.0.0.1:8001/api/recetas/recientes');
  }

  buscarReceta(query: string): Observable<RecetaModel[]> {
    return this._http.get<RecetaModel[]>(`http://127.0.0.1:8001/api/recetas/search?q=${query}`);
  }

  getReceta(id:number): Observable<RecetaModel> {
    return this._http.get<RecetaModel>(`http://127.0.0.1:8001/api/recetas/${id}`);
  }

  getCategorias(): Observable<CategoriaModel[]> {
    return this._http.get<CategoriaModel[]>('http://127.0.0.1:8001/api/categorias');
  }

  crearReceta(receta: RecetaModel) {    
    const body = {
      tiempo: receta.tiempo,
      descripcion: receta.descripcion,
      estado: receta.estado,
      fecha: receta.fecha,
      nombre: receta.nombre,
      categorias: receta.categoriasId,
      imagenes: receta.imagenUrl,
      ingredientes: receta.ingrediente,
      usuario: receta.usuarioId,
      complejidad: receta.complejidad,
      numeroPersonas: receta.numeroPersonas,
      pasos: receta.paso
    };
    console.log(body);
    
    return this._http.post<RecetaModel>('http://127.0.0.1:8001/api/recetas/crear', body);

  }
  crearLista(lista: ListaModel): Observable<any> {
    const body = {
      nombre: lista.nombre,
      descripcion: lista.descripcion,
      imagen: lista.imagen,
      usuario_id: lista.usuario_id
    };
    console.log(body);
    
    return this._http.post('http://127.0.0.1:8001/api/lista/crear', body);
  }

  addRecetaToLista(listaId: number, recetaId: number): Observable<any> {
    const url = `http://127.0.0.1:8001/api/lista/${listaId}/add-receta`;
    const body = { receta_id: recetaId };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post<any>(url, body, { headers });
  }

  editarLista(listaId: number, listaData: any): Observable<any> {
    console.log(listaData);
    console.log(listaId);
    
    
    return this._http.put(`http://127.0.0.1:8001/api/lista/${listaId}/edit`, listaData);
  }

  eliminarReceta(id: number): Observable<any> {
    const url = `http://127.0.0.1:8001/api/recetas/delete/${id}`;
    return this._http.delete<any>(url);
  }
 
  eliminarRecetaDeLista(listaId: number, recetaId: number): Observable<any> {
    const url = `http://127.0.0.1:8001/api/lista/${listaId}/receta/${recetaId}`;
    return this._http.delete(url);
  }

  eliminareLista(listaId: number): Observable<any> {
    const url = `http://127.0.0.1:8001/api/lista/${listaId}`;
    return this._http.delete(url);
  }

  getRecetasPorCategoria(categoria: string): Observable<any> {
    return this._http.get<any>(`http://127.0.0.1:8001/api/recetas/categoria/${categoria}`);
  }

  updatePuntuacionReceta(id: number, puntuacion: number): Observable<any> {
    return this._http.put<any>(`http://127.0.0.1:8001/api/recetas/${id}/puntuacion`, { puntuacion });
  }

 


}