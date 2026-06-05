import { Component, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories.html',
  styleUrls: ['./stories.scss'],
})
export class Stories {
  @Output() completou = new EventEmitter<void>();

  slideAtual = 0;
  slides = [
    { texto: 'Tudo começou aqui...', imagemUrl: '27.jpeg' },
    { texto: '', imagemUrl: 'travis.jpeg' },
    { texto: '', imagemUrl: '25.jpeg' },
    { texto: '', imagemUrl: 'spotify.jpeg' },
    { texto: '', imagemUrl: '2.jpeg' },
    { texto: '', imagemUrl: 'fotnite.jpeg' },
    { texto: 'E finalmente...', imagemUrl: 'brasilia.jpeg' },
    { texto: '', imagemUrl: '4.jpeg' },
    { texto: '', imagemUrl: '3.jpeg' },
    { texto: '', imagemUrl: '5.jpeg' },
    { texto: '', imagemUrl: '2.gif' },
    { texto: '', imagemUrl: '6.jpeg' },
    { texto: '', imagemUrl: '8.jpeg' },
    { texto: '', imagemUrl: '3.gif' },
    { texto: '', imagemUrl: '13.jpeg' },
    { texto: '', imagemUrl: '21.jpeg' },
    { texto: '', imagemUrl: '43.jpeg' },
    { texto: '', imagemUrl: '57.jpeg' },
    { texto: '', imagemUrl: '7.jpeg' },
    { texto: 'No final...', imagemUrl: '19.jpeg' },
    { texto: 'Sempre dá certo.', imagemUrl: '20.jpeg' },
    { texto: '', imagemUrl: '17.jpeg' },
    { texto: '', imagemUrl: '15.jpeg' },
    { texto: '', imagemUrl: '16.jpeg' },
    { texto: '', imagemUrl: '6.gif' },
    { texto: '', imagemUrl: '60.jpeg' },
    { texto: '', imagemUrl: '14.jpeg' },
    { texto: '', imagemUrl: '12.jpeg' },
    { texto: '', imagemUrl: '8.gif' },
    { texto: '', imagemUrl: '11.jpeg' },
    { texto: '', imagemUrl: '23.jpeg' },
    { texto: '', imagemUrl: '50.jpeg' },
    { texto: '', imagemUrl: '22.jpeg' },
    { texto: '', imagemUrl: '10.jpeg' },
    { texto: '', imagemUrl: '55.jpeg' },
    { texto: '', imagemUrl: '7.gif' },
    { texto: '', imagemUrl: '5.gif' },
    { texto: '', imagemUrl: '24.jpeg' },
    { texto: '', imagemUrl: '18.jpeg' },
    { texto: '', imagemUrl: '1.gif' },
    { texto: '', imagemUrl: 'discord.jpeg' },
    { texto: '', imagemUrl: 'mae.gif' },
    { texto: '', imagemUrl: '58.jpeg' },
    { texto: '', imagemUrl: '59.jpeg' },
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  voltarSlide(event: Event) {
    event.stopPropagation();

    if (this.slideAtual > 0) {
      this.slideAtual--;
      this.cdr.detectChanges();
    }
  }

  proximoSlide() {
    if (this.slideAtual < this.slides.length - 1) {
      this.slideAtual++;
    } else {
      this.completou.emit();
    }

    this.cdr.detectChanges();
  }
}
