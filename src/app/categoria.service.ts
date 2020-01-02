import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categoria } from './categoria';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private url = environment.host + 'categorias';

  constructor(private http: HttpClient) { }

  public listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url);
  }
}
