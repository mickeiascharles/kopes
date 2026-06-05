import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelaInicial } from './components/tela-inicial/tela-inicial';
import { EstacaoRadio } from './components/estacao-radio/estacao-radio';
import { TempoConexao } from './components/tempo-conexao/tempo-conexao';
import { MiniQuest } from './components/mini-quest/mini-quest';
import { MapaJornada } from './components/mapa-jornada/mapa-jornada';
import { Stories } from './components/stories/stories';
import { TelaFinal } from './components/tela-final/tela-final';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TelaInicial,
    EstacaoRadio,
    TempoConexao,
    MiniQuest,
    MapaJornada,
    Stories,
    TelaFinal,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  telaAtual = 0;

  avancarTela() {
    if (this.telaAtual < 6) {
      this.telaAtual++;
    } else {
      this.telaAtual = 0;
    }
  }

  voltarInicio() {
    this.telaAtual = 0;
  }
}
