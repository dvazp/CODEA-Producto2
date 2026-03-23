import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { infoJugadores } from '../common/datos/infoJugadores';
import { infoVideos } from '../common/datos/infoVideos';

interface Player {
  nombre: string;
  equipo: string;
  posicion: string;
  altura: string;
  edad: number;
  pPP: number;
  rPP: number;
  aPP: number;
  porcentajeTiros: number;
  img: string;
}

@Component({
  selector: 'app-media',
  standalone: true,
  imports: [

    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
  ],
  templateUrl: './mediaComponent.html',
  styleUrl: './mediaComponent.css',
})
export class MediaComponent {
  @Input() player?: Player;
  jugadores = infoJugadores;
  videos = infoVideos;
  
  getVideoForPlayer(jugadorNombre: string) {
    return this.videos.find(video => video.nombre === jugadorNombre);
  }
}
