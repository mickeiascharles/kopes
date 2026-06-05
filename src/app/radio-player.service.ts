import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export interface Musica {
  titulo: string;
  artista: string;
  arquivo: string;
  capaUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class RadioPlayerService {
  musicas: Musica[] = [
    {
      titulo: 'Forrest Gump',
      artista: 'Frank Ocean',
      arquivo: 'forrest_gump.mp3',
      capaUrl: 'https://i.scdn.co/image/ab67616d0000b2737aede4855f6d0d738012e2e5',
    },
    {
      titulo: 'Virginia Beach',
      artista: 'Drake',
      arquivo: 'virginia_beach.mp3',
      capaUrl: 'https://i.scdn.co/image/ab67616d0000b2730ebdbd881e232d18445ace27',
    },
    {
      titulo: 'Um Amor Puro',
      artista: 'Djavan',
      arquivo: 'um_amor_puro.mp3',
      capaUrl: 'https://i.scdn.co/image/ab67616d0000b273e84d18937e46c24bcdff259a',
    },
    {
      titulo: 'Get It Together',
      artista: 'Drake, Black Coffee, Jorja Smith',
      arquivo: 'GET.mp3',
      capaUrl: 'https://i.scdn.co/image/ab67616d0000b273b5e29a4897d7cce79673910a',
    },
  ];

  musicaAtualIndex = signal(0);
  isPlaying = signal(false);

  private audio?: HTMLAudioElement;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      this.criarAudio();
    }
  }

  get musicaAtual(): Musica {
    return this.musicas[this.musicaAtualIndex()];
  }

  togglePlay(): void {
    if (this.isPlaying()) {
      this.pausar();
      return;
    }

    void this.tocar();
  }

  proximaMusica(): void {
    const estavaTocando = this.isPlaying();
    this.musicaAtualIndex.set((this.musicaAtualIndex() + 1) % this.musicas.length);
    this.carregarAudioAtual();

    if (estavaTocando) {
      void this.tocar();
    }
  }

  musicaAnterior(): void {
    const estavaTocando = this.isPlaying();
    this.musicaAtualIndex.set(
      (this.musicaAtualIndex() - 1 + this.musicas.length) % this.musicas.length,
    );
    this.carregarAudioAtual();

    if (estavaTocando) {
      void this.tocar();
    }
  }

  private criarAudio(): void {
    this.audio = new Audio();
    this.audio.preload = 'auto';
    this.audio.addEventListener('ended', () => this.proximaMusica());
    this.carregarAudioAtual();
  }

  private carregarAudioAtual(): void {
    if (!this.audio) return;

    this.audio.src = this.musicaAtual.arquivo;
    this.audio.load();
  }

  private async tocar(): Promise<void> {
    if (!this.audio) return;

    try {
      await this.audio.play();
      this.isPlaying.set(true);
    } catch (erro) {
      console.error('Erro ao tocar:', erro);
      this.isPlaying.set(false);
    }
  }

  private pausar(): void {
    this.audio?.pause();
    this.isPlaying.set(false);
  }
}
