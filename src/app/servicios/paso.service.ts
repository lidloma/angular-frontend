import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasoService {

  constructor(private _http: HttpClient) { }


  crearPaso(paso: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.post(`http://127.0.0.1/api/pasos/crear`, paso, { headers });
  }
}
