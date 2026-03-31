import { Component, Input, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

import { JugadoresService } from "../common/services/jugadoresService";
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
  private playerSignal = signal<Player | undefined>(undefined);
  @Input() set player(value: Player | undefined) {
    this.playerSignal.set(value);
  }
  get player() {
    return this.playerSignal();
  }

  private jugadoresService = inject(JugadoresService);
  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  
  readonly videoSrc = computed(() => {
    const p = this.playerSignal();
    console.log('Calculando video para:', p?.nombre);
    if (!p) return '';
    if ((p as any).vid) return (p as any).vid;
    const found = this.players().find(j => j.nombre === p.nombre);
    return found?.vid || '';
  });
}
