import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type StorySlide = {
  texto: string;
  imagemUrl: string;
};

type NavigatorComConexao = Navigator & {
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
};

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stories.html',
  styleUrls: ['./stories.scss'],
})
export class Stories implements OnInit, OnDestroy {
  @Output() completou = new EventEmitter<void>();

  slideAtual = 0;
  imagemAnteriorUrl = '';
  imagemPronta = false;

  slides: StorySlide[] = [
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

  private imagensPreload = new Map<string, HTMLImageElement>();
  private linksPreload = new Set<string>();
  private timersJanelaPreload: number[] = [];
  private timersGifsPreload: number[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.prepararSlideAtual();
    this.precarregarGifsEmSegundoPlano();
  }

  voltarSlide(event: Event) {
    event.stopPropagation();

    if (this.slideAtual > 0) {
      this.trocarSlide(this.slideAtual - 1);
    }
  }

  proximoSlide() {
    if (this.slideAtual < this.slides.length - 1) {
      this.trocarSlide(this.slideAtual + 1);
      return;
    }

    this.completou.emit();
  }

  imagemCarregada() {
    this.imagemPronta = true;

    window.setTimeout(() => {
      this.imagemAnteriorUrl = '';
      this.cdr.detectChanges();
    }, 120);
  }

  imagemErro() {
    this.imagemCarregada();
  }

  trackByIndex(index: number) {
    return index;
  }

  private trocarSlide(novoSlide: number): void {
    this.imagemAnteriorUrl = this.slides[this.slideAtual].imagemUrl;
    this.slideAtual = novoSlide;
    this.prepararSlideAtual();
    this.cdr.detectChanges();
  }

  private prepararSlideAtual(): void {
    const imagemAtual = this.slides[this.slideAtual].imagemUrl;

    this.precarregarImagem(imagemAtual, true);
    this.imagemPronta = this.imagemEstaCarregada(imagemAtual);
    this.precarregarJanela();

    if (this.imagemPronta) {
      window.setTimeout(() => {
        this.imagemAnteriorUrl = '';
        this.cdr.detectChanges();
      }, 80);
    }
  }

  private precarregarJanela(): void {
    this.limparTimers(this.timersJanelaPreload);
    this.timersJanelaPreload = [];

    const indices = [this.slideAtual, this.slideAtual + 1, this.slideAtual + 2, this.slideAtual + 3, this.slideAtual + 4]
      .filter((index) => index >= 0 && index < this.slides.length);

    indices.forEach((index, ordem) => {
      const timer = window.setTimeout(() => {
        this.precarregarImagem(this.slides[index].imagemUrl, ordem <= 1);
      }, ordem * 260);

      this.timersJanelaPreload.push(timer);
    });
  }

  private precarregarGifsEmSegundoPlano(): void {
    if (this.conexaoLimitada()) return;

    const gifs = this.slides
      .map((slide) => slide.imagemUrl)
      .filter((url) => url.toLowerCase().endsWith('.gif'));

    gifs.forEach((url, index) => {
      const timer = window.setTimeout(() => this.precarregarImagem(url), 2500 + index * 3200);
      this.timersGifsPreload.push(timer);
    });
  }

  private precarregarImagem(url: string, prioridade = false): void {
    if (!url || this.imagensPreload.has(url)) return;

    this.adicionarPrefetch(url);

    const imagem = new Image();
    imagem.decoding = 'async';
    imagem.loading = prioridade ? 'eager' : 'lazy';

    if ('fetchPriority' in imagem) {
      (imagem as HTMLImageElement & { fetchPriority: string }).fetchPriority = prioridade ? 'high' : 'low';
    }

    imagem.onload = () => {
      if (url === this.slides[this.slideAtual].imagemUrl) {
        this.imagemPronta = true;
        this.cdr.detectChanges();
      }
    };

    imagem.onerror = () => {
      if (url === this.slides[this.slideAtual].imagemUrl) {
        this.imagemPronta = true;
        this.cdr.detectChanges();
      }
    };

    this.imagensPreload.set(url, imagem);
    imagem.src = url;
  }

  private adicionarPrefetch(url: string): void {
    if (this.linksPreload.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
    this.linksPreload.add(url);
  }

  private imagemEstaCarregada(url: string): boolean {
    const imagem = this.imagensPreload.get(url);
    return !!imagem?.complete && imagem.naturalWidth > 0;
  }

  private conexaoLimitada(): boolean {
    const conexao = (navigator as NavigatorComConexao).connection;
    return !!conexao?.saveData || /(^|-)2g$/.test(conexao?.effectiveType ?? '');
  }

  private limparTimers(timers: number[]): void {
    timers.forEach((timer) => window.clearTimeout(timer));
  }

  ngOnDestroy() {
    this.limparTimers(this.timersJanelaPreload);
    this.limparTimers(this.timersGifsPreload);
    this.imagensPreload.clear();
  }
}
