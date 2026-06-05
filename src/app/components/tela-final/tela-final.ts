import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tela-final',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tela-final.html',
  styleUrls: ['./tela-final.scss'],
})
export class TelaFinal {
  @Output() reiniciar = new EventEmitter<void>();

  private inicioDeslizeY = 0;

  iniciarDeslize(event: TouchEvent | PointerEvent) {
    this.inicioDeslizeY = this.pegarPosicaoY(event);
  }

  finalizarDeslize(event: TouchEvent | PointerEvent) {
    const fimDeslizeY = this.pegarPosicaoY(event);
    const distanciaDeslize = fimDeslizeY - this.inicioDeslizeY;

    if (distanciaDeslize > 80) {
      this.reiniciar.emit();
    }
  }

  private pegarPosicaoY(event: TouchEvent | PointerEvent): number {
    if ('changedTouches' in event) {
      return event.changedTouches[0]?.clientY ?? 0;
    }

    return event.clientY;
  }
}
