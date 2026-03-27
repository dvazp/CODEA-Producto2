import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { JugadoresService } from "../common/datos/services/jugadoresService";
import { toSignal } from "@angular/core/rxjs-interop";

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

  private jugadoresService = inject(JugadoresService);
  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  
  readonly videoSrc = computed(() => {
    console.log('Calculando video para:', this.player?.nombre);
    const found = this.players().find(j => j.nombre === this.player?.nombre);
    return found?.vid || '';
  });
}
