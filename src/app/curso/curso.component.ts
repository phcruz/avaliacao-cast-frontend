import { Component, OnInit } from '@angular/core';
import { Curso } from '../curso';
import { ConfirmationService, Message } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CursoService } from '../curso.service';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css'],
  providers: [ConfirmationService]
})
export class CursoComponent implements OnInit {

  public cursos: Curso[];
  msgs: Message[] = [];
  hasCursos: boolean;

  constructor(private confirmationService: ConfirmationService,
              private datepipe: DatePipe,
              private router: Router,
              private cursoService: CursoService) { }

  ngOnInit() {
    this.cursos = [];
    this.listarCursos();

  }

  public listarCursos() {
    this.cursoService.listarCursos().subscribe(
      response => {
        this.cursos = response;
        this.hasCursos = this.cursos.length > 0 ? true : false;
      },
      err => {
        this.hasCursos = false;
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Erro ao tentar listar cursos: ', detail: err.error.message});
      }
    );
  }

  public deletarCurso(id: string, descricao: string) {
    this.confirmationService.confirm({
      message: 'Deseja realmente excluir o curso' + descricao + '?',
      accept: () => {
        this.cursoService.deletarCurso(id).subscribe(
          response => {
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Curso removido com sucesso', detail: ''});
            this.listarCursos();
          },
          err => {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: 'Erro ao tentar deletar o curso: ', detail: err.error.message});
          }
        );
      }
    });
  }

  public exportarPdf() {
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        const header = [['Código', 'Descrição', 'Data início', 'Data término', 'Qtd. alunos', 'Categoria']];
        const rows = [];
        const data = this.cursos;

        data.forEach(elm => {
          const temp = [elm.id, elm.descricao,
          this.datepipe.transform(elm.dataInicio, 'dd/MM/yyyy'),
          this.datepipe.transform(elm.dataFim, 'dd/MM/yyyy'),
          elm.qtdAlunos, elm.categoria.descricao];
          rows.push(temp);
          console.log('Rows', rows);
        });

        doc.autoTable({
          head: header,
          body: rows,
        });

        doc.save('cursos_' + new Date().getTime() + '.pdf');
      });
    });

  }

  public editarCurso(curso: Curso) {
    this.router.navigateByUrl('curso/novo', { state: curso });
  }


  public exportarExcel() {
    import('xlsx').then(xlsx => {

      const data = [];

      this.cursos.forEach(item => {

        data.push({ id: '' + item.id, descricao: item.descricao,
          data_inicio: this.datepipe.transform(item.dataInicio, 'dd/MM/yyyy'),
          data_fim: this.datepipe.transform(item.dataFim, 'dd/MM/yyyy'),
          qtd_alunos: '' + item.qtdAlunos, categoria: item.categoria.descricao });

      });

      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.salvarComoArquivoExcel(excelBuffer, 'cursos');
    });
}

public salvarComoArquivoExcel(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
    });
}
}
