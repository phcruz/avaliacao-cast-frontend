import { Categoria } from './categoria';

export class Curso {

    public id: number;
    public descricao: string;
    public dataInicio: Date;
    public dataFim: Date;
    public qtdAlunos: number;
    public categoria: Categoria;

    public constructor() {}
}
