import { Component, signal, inject } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JugadoresService } from "../common/datos/services/jugadoresService";
import { MediaComponent } from '../mediaComponent/mediaComponent';
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
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, MediaComponent],
  templateUrl: './detailComponent.html',
  styleUrl: './detailComponent.css'
})
export class DetailComponent {
  protected readonly title = signal('CODEA-Producto1');
  private jugadoresService = inject(JugadoresService);
  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  readonly player = signal<Player | undefined>(undefined);
  private route = inject(ActivatedRoute);

  constructor() {
    console.log('DetailComponent initialized with title:', this.title());

    this.route.paramMap.subscribe(params => {
      const nombre = params.get('nombre');
      if (nombre) {
        const found = this.players().find(j => j.nombre === nombre);
        this.player.set(found as Player | undefined);
      } else {
        this.player.set(undefined);
      }
    });
  }
}