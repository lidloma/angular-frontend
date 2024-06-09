import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IngredienteModel } from '../modelos/ingrediente.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  constructor(private _http: HttpClient) { }

  getIngredientes(): Observable<IngredienteModel[]> {
    return this._http.get<IngredienteModel[]>('http://127.0.0.1:8001/api/ingredientes');
  }

  crearIngrediente(ingrediente: any): Observable<any> {
    return this._http.post(`http://127.0.0.1:8001/api/ingredientes/crear`, ingrediente);
  }
}
