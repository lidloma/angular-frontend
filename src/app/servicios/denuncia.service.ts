import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DenunciaService {
  private _http: HttpClient;

  constructor(_http: HttpClient) { 
    this._http = _http;
  }

  denunciar(denuncia: any): Observable<any> {
    return this._http.post<any>(`http://127.0.0.1:8001/api/denunciar`, denuncia);
  }

  listarDenuncias(): Observable<any[]> {
    return this._http.get<any[]>(`http://127.0.0.1:8001/api/denuncias`);
  }
}
