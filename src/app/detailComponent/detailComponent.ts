import { Component, computed, inject } from "@angular/core";
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
  private jugadoresService = inject(JugadoresService);
  private route = inject(ActivatedRoute);

  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  private routeParams = toSignal(this.route.paramMap);

  readonly player = computed(() => {
    const nombre = this.routeParams()?.get('nombre');
    if (!nombre) return undefined;
    
    return this.players().find(j => j.nombre === nombre) as Player | undefined;
  });

  constructor() {
  }
}