import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CursoComponent } from './curso/curso.component';
import { CadastroCursoComponent } from './cadastro-curso/cadastro-curso.component';


const routes: Routes = [
  { path: 'curso', component: CursoComponent },
  { path: 'curso/novo', component: CadastroCursoComponent },
  { path: '', pathMatch: 'full', redirectTo: '/curso' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
