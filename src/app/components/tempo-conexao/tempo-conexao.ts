import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tempo-conexao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tempo-conexao.html',
  styleUrls: ['./tempo-conexao.scss'],
})
export class TempoConexao implements OnInit, OnDestroy {
  @Output() completou = new EventEmitter<void>();

  dataInicio = new Date('2024-09-15T18:30:00');
  tempoJuntos = { anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 };

  private timer?: ReturnType<typeof setInterval>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.calcularTempo();
    this.timer = setInterval(() => {
      this.calcularTempo();
      this.cdr.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  calcularTempo() {
    const agora = new Date();
    const diferenca = Math.abs(agora.getTime() - this.dataInicio.getTime());
    const diasTotais = Math.floor(diferenca / (1000 * 60 * 60 * 24));

    this.tempoJuntos.horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    this.tempoJuntos.minutos = Math.floor((diferenca / 1000 / 60) % 60);
    this.tempoJuntos.segundos = Math.floor((diferenca / 1000) % 60);
    this.tempoJuntos.anos = Math.floor(diasTotais / 365);
    this.tempoJuntos.meses = Math.floor((diasTotais % 365) / 30);
    this.tempoJuntos.dias = (diasTotais % 365) % 30;
  }

  avancarTela() {
    this.completou.emit();
  }
}
