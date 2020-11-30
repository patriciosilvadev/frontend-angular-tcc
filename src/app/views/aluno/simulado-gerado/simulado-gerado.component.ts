import { DomSanitizer } from '@angular/platform-browser';
import { SimuladoService } from './../../../_servicos/simulados/simulado.service';
import { Simulado } from './../../../_modelos/simulado';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CanComponentDeactivate } from './../../../_servicos/rota/deactivate-guard.service';
import { ConfirmacaoDialogoService } from './../../utils/caixa-dialogo/confirmacao-dialogo.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-simulado-gerado',
  templateUrl: './simulado-gerado.component.html',
  styleUrls: ['./simulado-gerado.component.css']
})
export class SimuladoGeradoComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  @ViewChild('cd', { static: false }) private cronometro: CountdownComponent;
  progresso: number;
  tempo: any;
  tempoAtual: number;
  habilitarBotao: boolean = true;
  imagem: string;
  textoBotao: string = "Próxima Questão"
  formulario: FormGroup;
  simulado: Simulado;
  index: number;
  quantidadeQuestoes: number;

  constructor(private router: Router, private sanitizer: DomSanitizer, private confirmacaoDialogoService: ConfirmacaoDialogoService, private fb: FormBuilder, private simuladoService: SimuladoService) {
    this.verificarSimulado();
    this.formulario = fb.group({
      alternativas: ['', Validators.required]
    });
    this.simulado = this.simuladoService.getSimuladoValor;
    this.index = Number(sessionStorage.getItem('index'));
    this.quantidadeQuestoes = Object.keys(this.simulado.Questoes).length;
  }

  ngOnInit(): void {
    console.log(this.simulado.Questoes);
    this.imagem = this.simulado.Questoes[this.index].ImagemQuestao;
  }

  ngOnDestroy(): void {
    sessionStorage.setItem("tempo", '');
    sessionStorage.setItem("tipoSimulado", '');
    sessionStorage.setItem("progresso", '');
    sessionStorage.setItem("index", '0');
  }

  canDeactivate() {
    if (this.index > (this.quantidadeQuestoes - 2)) {
      let result: Promise<boolean> = this.confirmacaoDialogoService.confirm('Seu progresso será perdido! Tem certeza que deseja sair?')
        .then((confirmed) => confirmed).catch(function () {
          return false;
        });
      return result;
    }
    return true;
  }

  getImagem() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.imagem);
  }

  verificarSimulado() {
    if (sessionStorage.getItem('tipoSimulado') == '' || sessionStorage.getItem('tipoSimulado') == null) {
      this.router.navigateByUrl("aluno/simulado");
    } else {
      this.tempoAtual = Number(sessionStorage.getItem('tempo'));
      this.tempo = { leftTime: this.tempoAtual };
      this.progresso = Number(sessionStorage.getItem('progresso'));
    }
  }

  /*Salvando as informações caso o usuário atualize a página*/
  @HostListener('window:beforeunload') salvarDadosAntesDeAtualizar() {
    this.cronometro.pause();
    sessionStorage.setItem('progresso', JSON.stringify(this.progresso));
    sessionStorage.setItem('index', this.index.toString());
  }

  getTempoAtual($event) {
    this.tempoAtual = $event.left;
    //Removendo os 0's a direita que o countdown adiciona 
    let tempoAtualString = this.tempoAtual.toString().slice(0, -3);
    sessionStorage.setItem("tempo", tempoAtualString);
  }

  proximaQuestao() {
    if (this.index == (this.quantidadeQuestoes - 2)) {
      this.textoBotao = "Finalizar Simulado"
    }

    if (this.index > (this.quantidadeQuestoes - 2)) {
      this.router.navigateByUrl("aluno/dashboard");
      sessionStorage.setItem("tempo", '');
      sessionStorage.setItem("tipoSimulado", '');
      sessionStorage.setItem("progresso", '');
      sessionStorage.setItem("index", '');
    } else {
      this.imagem = "";
      this.index++;
      this.progresso = this.progresso + (100 / this.quantidadeQuestoes);
      this.formulario.get('alternativas').reset();
      this.ngOnInit();
    }
  }

  converterMinutosEmSegundos(minutos: number) {
    return minutos * 60;
  }
}
