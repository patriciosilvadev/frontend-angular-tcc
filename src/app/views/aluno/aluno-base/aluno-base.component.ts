import { AutenticacaoService } from '../../../_servicos/login/autenticacao.service';
import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aluno-base',
  templateUrl: './aluno-base.component.html',
  styleUrls: ['./aluno-base.component.css']
})
export class AlunoBaseComponent implements OnInit{

  listaTitulosNavbar = ['Dashboard', 'Simulado', 'Sala', 'Configurações', 'Suporte'];
  idTitulo:any;
  aberta: boolean = false;
  usuario: any;
  base64Image: string;

  constructor(private autenticacaoService: AutenticacaoService, private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    this.usuario = autenticacaoService.getUsuario;
    this.base64Image = this.usuario.ImagemUsuario;    
    this.idTitulo = localStorage.getItem('idTituloAluno');
  }
 
  getImagem() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.base64Image);
  }

  ngOnInit() {
  }


  botaoSidebar(id:number) {
    this.idTitulo = id;
    localStorage.setItem('idTituloAluno', JSON.stringify(this.idTitulo));
    this.aberta = !this.aberta;
  }

  logout() {
    this.autenticacaoService.logout();
  }

}
