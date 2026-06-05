import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class MapaJornada {
  @Output() completouMapa = new EventEmitter<void>();

  localAtual = 0;
  mapaUrl: SafeResourceUrl;

  locais: LocalMapa[] = [
    {
      nome: 'Onde tudo começou...',
      coords: [-22.9068, -43.1729],
      foto: 'foto_rio.webp',
    },
    {
      nome: 'Se conhecemos pessoalmente',
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
      nome: 'Ainda vamos (Chapada)',
      coords: [-14.5141026, -48.1311545],
      foto: 'https://emalgumlugardomundo.com.br/wp-content/uploads/2022/09/roteiro-chapada-dos-veadeiros-vale-da-lua-3.jpg',
    },
    {
      nome: 'Ainda vamos juntos (POA)',
      coords: [-30.0431582, -51.1771419],
      foto: 'https://www.civitatis.com/blog/wp-content/uploads/2024/10/panoramica-1280x720.jpg',
    },
    {
      nome: 'Ainda vamos juntos (Santa Rosa)',
      coords: [-27.8666914, -54.4991042],
      foto: 'https://prefeitura.santarosa.rs.gov.br/wp-content/uploads/2023/06/Formato-Site-e-Portal-860X645-JPG-2023-06-30T085421.530.jpg',
    },
    {
      nome: 'Ainda vamos juntos (Felixlandia)',
      coords: [-18.7568894, -44.8989286],
      foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv3g1cKCG4pzlKFhU-QXpNPjBl2TYaS6LsoQ&s',
    },
    {
      nome: 'Ainda vamos voltar (RJ)',
      coords: [-22.9068, -43.1729],
      foto: 'foto_rio.webp',
    },
    {
      nome: 'Ainda vamos (Japão)',
      coords: [35.6683524, 139.4112508],
      foto: 'https://gife.org.br/wp/media/2024/10/Site.jpeg',
    },
    {
      nome: 'Ainda vamos (Austrália)',
      coords: [-33.858968, 151.1968026],
      foto: 'https://www.estudarfora.org.br/wp-content/uploads/2021/01/Australia.jpg',
    },
    {
      nome: 'Ainda vamos (Espanha)',
      coords: [40.4098063, -3.7176519],
      foto: 'https://midias.eurodicas.com.br/wp-content/uploads/2019/04/mapa-da-espanha-1.jpg.webp',
    },
    {
      nome: 'Ainda vamos (Itália)',
      coords: [41.8832234, 12.4498183],
      foto: 'https://americachip.com/wp-content/uploads/2022/12/Italia.png',
    },
    {
      nome: 'Onde estamos...',
      coords: [-15.8365533, -47.8660198],
      foto: 'asadelta.jpeg',
    },
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.mapaUrl = this.criarMapaUrl(this.locais[this.localAtual].coords);
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

  private atualizarMapa(): void {
    this.mapaUrl = this.criarMapaUrl(this.locais[this.localAtual].coords);
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
}
