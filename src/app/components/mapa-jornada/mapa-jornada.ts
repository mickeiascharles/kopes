import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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

  private map: any;
  private L: any;
  localAtual = 0;

  locais = [
    {
      nome: 'Onde tudo começou...',
      coords: [-22.9068, -43.1729] as [number, number],
      foto: 'foto_rio.webp',
    },
    {
      nome: 'Se conhecemos pessoalmente',
      coords: [-15.8405442, -48.0210344] as [number, number],
      foto: '3.jpeg',
    },
    {
      nome: 'Um momento decisivo...',
      coords: [-15.7785977, -47.8976916] as [number, number],
      foto: '20.jpeg',
    },
    {
      nome: 'Um momento importante...',
      coords: [-15.7714764, -47.8329699] as [number, number],
      foto: 'dia_importante.jpeg',
    },
    {
      nome: 'Primeira "viagem"',
      coords: [-16.0087033, -47.5534341] as [number, number],
      foto: '24.jpeg',
    },
    {
      nome: 'Nosso cantinho',
      coords: [-15.8347215, -48.0138279] as [number, number],
      foto: 'nosso_canto.jpeg',
    },
    {
      nome: 'Ainda vamos (Chapada)',
      coords: [-14.5141026, -48.1311545] as [number, number],
      foto: 'https://emalgumlugardomundo.com.br/wp-content/uploads/2022/09/roteiro-chapada-dos-veadeiros-vale-da-lua-3.jpg',
    },
    {
      nome: 'Ainda vamos juntos (POA)',
      coords: [-30.0431582, -51.1771419] as [number, number],
      foto: 'https://www.civitatis.com/blog/wp-content/uploads/2024/10/panoramica-1280x720.jpg',
    },
    {
      nome: 'Ainda vamos juntos (Santa Rosa)',
      coords: [-27.8666914, -54.4991042] as [number, number],
      foto: 'https://prefeitura.santarosa.rs.gov.br/wp-content/uploads/2023/06/Formato-Site-e-Portal-860X645-JPG-2023-06-30T085421.530.jpg',
    },
    {
      nome: 'Ainda vamos juntos (Felixlandia)',
      coords: [-18.7568894, -44.8989286] as [number, number],
      foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv3g1cKCG4pzlKFhU-QXpNPjBl2TYaS6LsoQ&s',
    },
    {
      nome: 'Ainda vamos voltar (RJ)',
      coords: [-22.9068, -43.1729] as [number, number],
      foto: 'foto_rio.webp',
    },
    {
      nome: 'Ainda vamos (Japão)',
      coords: [35.6683524, 139.4112508] as [number, number],
      foto: 'https://gife.org.br/wp/media/2024/10/Site.jpeg',
    },
    {
      nome: 'Ainda vamos (Austrália)',
      coords: [-33.858968, 151.1968026] as [number, number],
      foto: 'https://www.estudarfora.org.br/wp-content/uploads/2021/01/Australia.jpg',
    },
    {
      nome: 'Ainda vamos (Espanha)',
      coords: [40.4098063, -3.7176519] as [number, number],
      foto: 'https://midias.eurodicas.com.br/wp-content/uploads/2019/04/mapa-da-espanha-1.jpg.webp',
    },
    {
      nome: 'Ainda vamos (Itália)',
      coords: [41.8832234, 12.4498183] as [number, number],
      foto: 'https://americachip.com/wp-content/uploads/2022/12/Italia.png',
    },
    {
      nome: 'Onde estamos...',
      coords: [-15.8365533, -47.8660198] as [number, number],
      foto: 'asadelta.jpeg',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.L = await import('leaflet');
    requestAnimationFrame(() => requestAnimationFrame(() => this.iniciarMapa()));
  }

  private iniciarMapa(): void {
    if (this.map || !this.L || !this.mapaInterativo?.nativeElement) return;

    this.map = this.L.map(this.mapaInterativo.nativeElement, {
      zoomControl: false,
      attributionControl: false,
      tap: false,
    }).setView(this.locais[this.localAtual].coords, 13);

    this.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      crossOrigin: true,
    }).addTo(this.map);

    const iconeCoracao = this.L.divIcon({
      html: '<div class="marcador-coracao">&#10084;&#65039;</div>',
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    this.locais.forEach((local) => {
      this.L.marker(local.coords, { icon: iconeCoracao }).addTo(this.map);
    });

    this.atualizarTamanhoMapa();
  }

  private atualizarTamanhoMapa(): void {
    [0, 250, 800, 1500].forEach((delay) => {
      setTimeout(() => this.map?.invalidateSize(), delay);
    });
  }

  proximoLocal() {
    if (this.localAtual < this.locais.length - 1) {
      this.localAtual++;
      this.voarParaLocal();
    } else {
      this.completouMapa.emit();
    }
  }

  localAnterior() {
    if (this.localAtual > 0) {
      this.localAtual--;
      this.voarParaLocal();
    }
  }

  voarParaLocal() {
    if (this.map) {
      this.map.flyTo(this.locais[this.localAtual].coords, 13, {
        animate: true,
        duration: 1.5,
      });
      this.atualizarTamanhoMapa();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}
