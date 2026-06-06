import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as L from 'leaflet';

type LocalMapa = {
  nome: string;
  coords: [number, number];
  foto: string;
};

@Component({
  selector: 'app-mapa-jornada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-jornada.html',
  styleUrls: ['./mapa-jornada.scss'],
})
export class MapaJornada implements AfterViewInit, OnDestroy {
  @Output() completouMapa = new EventEmitter<void>();
  @ViewChild('mapaInterativo') mapaInterativo?: ElementRef<HTMLDivElement>;

  localAtual = 0;
  mapaPronto = false;
  usandoFallback = false;
  mapaUrl: SafeResourceUrl;

  locais: LocalMapa[] = [
    {
      nome: 'Onde tudo começou...',
      coords: [-22.9068, -43.1729],
      foto: 'foto_rio.webp',
    },
    {
      nome: 'Nos conhecemos pessoalmente',
      coords: [-15.8405442, -48.0210344],
      foto: '3.jpeg',
    },
    {
      nome: 'Um momento decisivo...',
      coords: [-15.7785977, -47.8976916],
      foto: '20.jpeg',
    },
    {
      nome: 'Um momento importante...',
      coords: [-15.7714764, -47.8329699],
      foto: 'dia_importante.jpeg',
    },
    {
      nome: 'Primeira "viagem"',
      coords: [-16.0087033, -47.5534341],
      foto: '24.jpeg',
    },
    {
      nome: 'Nosso cantinho',
      coords: [-15.8347215, -48.0138279],
      foto: 'nosso_canto.jpeg',
    },
    {
      nome: 'Nosso outro cantinho',
      coords: [-15.704022, -48.12413],
      foto: 'meu_quarto.jpeg',
    },
    {
      nome: 'Ainda vamos (Chapada)',
      coords: [-14.5141026, -48.1311545],
      foto: 'https://emalgumlugardomundo.com.br/wp-content/uploads/2022/09/roteiro-chapada-dos-veadeiros-vale-da-lua-3.jpg',
    },
    {
      nome: 'Ainda vamos juntos',
      coords: [-30.0431582, -51.1771419],
      foto: 'https://www.civitatis.com/blog/wp-content/uploads/2024/10/panoramica-1280x720.jpg',
    },
    {
      nome: 'Ainda vamos juntos',
      coords: [-27.8666914, -54.4991042],
      foto: 'https://prefeitura.santarosa.rs.gov.br/wp-content/uploads/2023/06/Formato-Site-e-Portal-860X645-JPG-2023-06-30T085421.530.jpg',
    },
    {
      nome: 'Ainda vamos juntos',
      coords: [-18.7568894, -44.8989286],
      foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv3g1cKCG4pzlKFhU-QXpNPjBl2TYaS6LsoQ&s',
    },
    {
      nome: 'Ainda vamos voltar',
      coords: [-22.9068, -43.1729],
      foto: 'foto_rio.webp',
    },
    {
      nome: 'Ainda vamos',
      coords: [35.6683524, 139.4112508],
      foto: 'https://gife.org.br/wp/media/2024/10/Site.jpeg',
    },
    {
      nome: 'Ainda vamos',
      coords: [-33.858968, 151.1968026],
      foto: 'https://www.estudarfora.org.br/wp-content/uploads/2021/01/Australia.jpg',
    },
    {
      nome: 'Ainda vamos',
      coords: [40.4098063, -3.7176519],
      foto: 'https://midias.eurodicas.com.br/wp-content/uploads/2019/04/mapa-da-espanha-1.jpg.webp',
    },
    {
      nome: 'Ainda vamos',
      coords: [41.8832234, 12.4498183],
      foto: 'https://americachip.com/wp-content/uploads/2022/12/Italia.png',
    },
    {
      nome: 'Onde estamos...',
      coords: [-15.8365533, -47.8660198],
      foto: 'asadelta.jpeg',
    },
  ];

  private map?: L.Map;
  private marcadores: L.Marker[] = [];
  private rota?: L.Polyline;
  private tileFallbackAtivado = false;
  private tentativasInicio = 0;
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {
    this.mapaUrl = this.criarMapaUrl(this.locais[this.localAtual].coords);
  }

  get progressoMapa(): string {
    return `${((this.localAtual + 1) / this.locais.length) * 100}%`;
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => this.iniciarMapaQuandoVisivel());
  }

  proximoLocal() {
    if (this.localAtual < this.locais.length - 1) {
      this.localAtual++;
      this.atualizarMapa();
      return;
    }

    this.completouMapa.emit();
  }

  localAnterior() {
    if (this.localAtual > 0) {
      this.localAtual--;
      this.atualizarMapa();
    }
  }

  private iniciarMapaQuandoVisivel(): void {
    const elemento = this.mapaInterativo?.nativeElement;

    if (!elemento || elemento.clientWidth === 0 || elemento.clientHeight === 0) {
      this.tentativasInicio++;

      if (this.tentativasInicio <= 12) {
        this.agendar(() => this.iniciarMapaQuandoVisivel(), 120);
        return;
      }

      this.usandoFallback = true;
      this.cdr.detectChanges();
      return;
    }

    this.iniciarMapa(elemento);
  }

  private iniciarMapa(elemento: HTMLDivElement): void {
    if (this.map) return;

    try {
      this.map = L.map(elemento, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: true,
        dragging: true,
        inertia: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
      }).setView(this.locais[this.localAtual].coords, this.zoomAtual());

      const tilesBonitos = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          crossOrigin: true,
        },
      );

      tilesBonitos.on('tileerror', () => this.ativarTileFallback());
      tilesBonitos.addTo(this.map);

      this.marcadores = this.locais.map((local, index) =>
        L.marker(local.coords, {
          icon: this.criarIcone(index === this.localAtual),
          keyboard: false,
        }).addTo(this.map!),
      );

      this.rota = L.polyline(this.pontosDaRota(), {
        color: '#ff3b30',
        weight: 4,
        opacity: 0.9,
        dashArray: '2 12',
        className: 'mapa-rota',
      }).addTo(this.map);

      this.mapaPronto = true;
      this.cdr.detectChanges();
      this.atualizarMapa(false);
      this.atualizarTamanhoMapa();
    } catch {
      this.usandoFallback = true;
      this.cdr.detectChanges();
    }
  }

  private atualizarMapa(animar = true): void {
    this.mapaUrl = this.criarMapaUrl(this.locais[this.localAtual].coords);

    if (!this.map) return;

    this.marcadores.forEach((marcador, index) => {
      marcador.setIcon(this.criarIcone(index === this.localAtual));
    });

    this.rota?.setLatLngs(this.pontosDaRota());
    this.map.flyTo(this.locais[this.localAtual].coords, this.zoomAtual(), {
      animate: animar,
      duration: animar ? 1.6 : 0,
      easeLinearity: 0.25,
    });
    this.atualizarTamanhoMapa();
  }

  private ativarTileFallback(): void {
    if (!this.map || this.tileFallbackAtivado) return;

    this.tileFallbackAtivado = true;
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(this.map);
  }

  private criarIcone(ativo: boolean): L.DivIcon {
    return L.divIcon({
      className: ativo ? 'marcador-local marcador-local-ativo' : 'marcador-local',
      html: '<span></span>',
      iconSize: ativo ? [34, 34] : [18, 18],
      iconAnchor: ativo ? [17, 17] : [9, 9],
    });
  }

  private pontosDaRota(): [number, number][] {
    return this.locais.slice(0, this.localAtual + 1).map((local) => local.coords);
  }

  private zoomAtual(): number {
    return this.localAtual >= 11 ? 10 : 12;
  }

  private atualizarTamanhoMapa(): void {
    [0, 120, 300, 700, 1300].forEach((delay) => {
      this.agendar(() => {
        this.map?.invalidateSize();
        this.map?.setView(this.locais[this.localAtual].coords, this.zoomAtual(), {
          animate: false,
        });
      }, delay);
    });
  }

  private criarMapaUrl([lat, lon]: [number, number]): SafeResourceUrl {
    const deltaLat = 0.06;
    const deltaLon = 0.09;
    const bbox = [lon - deltaLon, lat - deltaLat, lon + deltaLon, lat + deltaLat].join(',');
    const params = new URLSearchParams({
      bbox,
      layer: 'mapnik',
      marker: `${lat},${lon}`,
    });

    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html?${params.toString()}`,
    );
  }

  private agendar(callback: () => void, delay: number): void {
    this.timeouts.push(setTimeout(callback, delay));
  }

  ngOnDestroy() {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }
}
