import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Pessoa } from './models/pessoas';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Consumir-Api';
  http = inject(HttpClient);
  urlApi = 'http://localhost:5141';

  // Listar Pessoas
  pessoas$?: Observable<Pessoa[]>;

  // Buscar Pessoa
  pessoaEncontrada$?: Observable<Pessoa>;
  valorBuscaPessoa = '';

  // Adicionar Pessoa
  nomeAdicionar = '';

  // Atualizar Pessoa
  idAtualizar = '';
  nomeAtualizar = '';
  ngOnInit(): void {
    this.obterPessoas();
  }

  obterPessoas() {
    this.pessoas$ = this.http.get<Pessoa[]>(`${this.urlApi}/pessoas`);
  }

  obterPessoaEspecifica() {
    if (!this.valorBuscaPessoa) {
      return;
    }
    this.pessoaEncontrada$ = this.http.get<Pessoa>(
      `${this.urlApi}/pessoas/${this.valorBuscaPessoa}`
    );
  }

  adicionarPessoa() {
    if (!this.nomeAdicionar) return;

    const pessoaCriar: Pessoa = {
      id: '147c5516-db97-4375-b7d2-d6ab2018e3ed',
      nome: this.nomeAdicionar,
    };

    this.http
      .post<void>(`${this.urlApi}/pessoas`, pessoaCriar)
      .subscribe(_ => {
        this.obterPessoas()
        this.nomeAdicionar = '';
  });
    // .subscribe(valor => console.log(valor))
  }

  obterDadosAtualizar(pessoa: Pessoa){
    console.log(pessoa)

    this.idAtualizar = pessoa.id;
    this.nomeAtualizar = pessoa.nome;
  }

  atualizarNome(){
    if(!this.nomeAtualizar || !this.idAtualizar){
      alert("Nome vazio ou id inválido");
      return;
    }
      

    const pessoa: Pessoa = {
      id: this.idAtualizar,
      nome : this.nomeAtualizar
    }

    const url = `${this.urlApi}/pessoas/${this.idAtualizar}`;
    this.http.put<Pessoa>(url, pessoa)
    .subscribe(_ => {
      this.obterPessoas()
      this.nomeAtualizar = ''})
  }

  deletarPessoa(pessoa: Pessoa){

    const url = `${this.urlApi}/pessoas/${pessoa.id}`;
    this.http.delete<void>(url)
    .subscribe(_ => {
      this.obterPessoas()
      this.nomeAtualizar = ''
    })
  }
}
