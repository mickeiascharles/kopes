import { Component, EventEmitter, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mini-quest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mini-quest.html',
  styleUrls: ['./mini-quest.scss'],
})
export class MiniQuest implements OnInit {
  @Output() completou = new EventEmitter<void>();

  palavras = ['SORRISO', 'BUNDA', 'MATURIDADE'];
  etapaAtual = 0;
  inputs: string[] = [];
  status: string[] = [];
  mensagem = '';
  acertouTudo = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.iniciarPalavra();
  }

  iniciarPalavra() {
    const tamanho = this.palavras[this.etapaAtual].length;
    this.inputs = new Array(tamanho).fill('');
    this.status = new Array(tamanho).fill('');
    this.mensagem = '';
    this.acertouTudo = false;
    this.cdr.detectChanges();
  }

  aoDigitar(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    this.inputs[index] = input.value.toUpperCase();

    if (this.inputs[index] && index < this.inputs.length - 1) {
      document.getElementById(`letra-${index + 1}`)?.focus();
    }

    this.cdr.detectChanges();
  }

  verificarPalavra() {
    const palavraCerta = this.palavras[this.etapaAtual];
    let acertou = true;

    for (let i = 0; i < palavraCerta.length; i++) {
      if (this.inputs[i] === palavraCerta[i]) {
        this.status[i] = 'correto';
      } else {
        this.status[i] = 'errado';
        acertou = false;
      }
    }

    if (acertou) {
      this.mensagem = 'Parabéns!';
      this.acertouTudo = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        if (this.etapaAtual < this.palavras.length - 1) {
          this.etapaAtual++;
          this.iniciarPalavra();
        } else {
          this.completou.emit();
        }
        this.cdr.detectChanges();
      }, 1500);
    } else {
      this.mensagem = 'Ops! Tente novamente.';
      this.cdr.detectChanges();
    }
  }

  trackByIndex(index: number): string {
    return `${this.etapaAtual}-${index}`;
  }
}
