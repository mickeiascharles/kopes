import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioPlayerService } from '../../radio-player.service';

@Component({
  selector: 'app-estacao-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estacao-radio.html',
  styleUrls: ['./estacao-radio.scss'],
})
export class EstacaoRadio {
  @Output() completou = new EventEmitter<void>();

  constructor(public player: RadioPlayerService) {}

  get musicaAtual() {
    return this.player.musicaAtual;
  }

  get isPlaying() {
    return this.player.isPlaying();
  }

  togglePlay() {
    this.player.togglePlay();
  }

  proximaMusica() {
    this.player.proximaMusica();
  }

  musicaAnterior() {
    this.player.musicaAnterior();
  }

  avancarTela() {
    this.completou.emit();
  }
}
