import { Component, OnInit } from '@angular/core';
import { Categoria } from '../categoria';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from '../curso';
import { CategoriaService } from '../categoria.service';
import { CursoService } from '../curso.service';
import { Message } from 'primeng/api/message';
import { isNull, isUndefined, log } from 'util';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cadastro-curso',
  templateUrl: './cadastro-curso.component.html',
  styleUrls: ['./cadastro-curso.component.css']
})
export class CadastroCursoComponent implements OnInit {

  msgs: Message[] = [];
  pt: any;
  public curso: Curso;
  public categorias: Categoria[];
  public categoriaSelecionada: Categoria;

  public listaCategoria: Categoria[];

  constructor(private router: Router,
              private categoriaService: CategoriaService,
              private cursoService: CursoService,
              private datepipe: DatePipe) {
    console.log(this.router.getCurrentNavigation().extras.state);

  }

  ngOnInit() {
    this.inicializaComponentes();
    this.listarCategorias();

    this.curso = history.state;
    const categoria: Categoria = this.curso.categoria;

    if (categoria != null) {

      this.curso.dataInicio = new Date(this.corrigeData(this.datepipe.transform(this.curso.dataInicio, 'dd/MM/yyyy')));
      this.curso.dataFim = new Date(this.corrigeData(this.datepipe.transform(this.curso.dataFim, 'dd/MM/yyyy')));
      this.categoriaSelecionada = categoria;
    }

  }

  public inicializaComponentes() {
    this.curso = new Curso();
    this.categoriaSelecionada = new Categoria();
    this.categorias = [];
    this.inicializaCalendarioPt();
  }

  public validaCamposForm() {
    this.msgs = [];
    if (this.curso.descricao == null || this.curso.descricao.trim() === '') {
      this.msgs.push({severity: 'error', summary: 'Descrição: ', detail: 'É obrigatório o preenchimento do campo descrição.'});
    }
    if (this.curso.dataInicio == null) {
      this.msgs.push({severity: 'error', summary: 'Data início: ', detail: 'É obrigatório preencher a data de início do curso.'});
    }
    if (this.curso.dataFim == null) {
      this.msgs.push({severity: 'error', summary: 'Data término: ', detail: 'É obrigatório preencher a data de término do curso.'});
    }
    if (this.categoriaSelecionada.id == null) {
      this.msgs.push({severity: 'error', summary: 'Categoria: ', detail: 'É obrigatório preencher a categoria do curso.'});
    }

    if (this.msgs.length === 0) {
      this.verificaMetodoSalvar();
    }
  }

  public verificaMetodoSalvar() {
    this.curso.categoria = this.categoriaSelecionada;

    if (this.curso.id == null) {
      this.salvarCurso();
    } else {
      this.alterarCurso();
    }
  }

  public salvarCurso() {
    this.cursoService.salvarCurso(this.curso).subscribe(
      response => {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: 'Curso salvo com sucesso', detail: ''});

        this.curso = new Curso();
        this.categoriaSelecionada = new Categoria();
      },
      err => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Erro ao tentar salvar o curso: ', detail: err.error.message});
      }
    );
  }

  public alterarCurso() {
    this.cursoService.alterarCurso(this.curso).subscribe(
      response => {
        this.msgs = [];
        this.msgs.push({severity: 'success', summary: 'Curso alterado com sucesso', detail: ''});

        this.curso = new Curso();
        this.categoriaSelecionada = new Categoria();
      },
      err => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Erro ao tentar alterar o curso: ', detail: err.error.message});
      }
    );
  }

  public listarCategorias() {
    this.categoriaService.listarCategorias().subscribe(
      response => {
        this.categorias = response;
        this.getCategoriasOption();
      },
      error => {
        alert('Erro ao carregar lista.');
      }
    );
  }

  public inicializaCalendarioPt() {
    this.pt = {
      firstDayOfWeek: 0,
      dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
      dayNamesShort: ['Dom', 'Sen', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
      dayNamesMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'],
      monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Wk'
    };
  }

  public getCategoriasOption() {
    this.listaCategoria = [];
    this.listaCategoria.push({descricao: 'Selecione', id: null});
    this.categorias.forEach(item => this.listaCategoria.push({descricao: item.descricao, id: item.id}));
  }

  public corrigeData(dataString: string): Date {
    const dateParts = dataString.split('/');

    return new Date(+dateParts[2], (+dateParts[1] - 1), +dateParts[0], 1, 1, 1);
  }

}
