import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Curso } from './curso';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  private url = environment.host + 'cursos';

  constructor(private http: HttpClient) { }

  public salvarCurso(curso: Curso): Observable<Curso> {
    return this.http.post<Curso>(this.url, curso);
  }

  public alterarCurso(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(this.url, curso);
  }

  public listarCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.url);
  }

  public deletarCurso(id: string): Observable<any> {
    return this.http.delete(this.url + '/' + id);
  }
}
