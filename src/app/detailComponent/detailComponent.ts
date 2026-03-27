import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JugadoresService } from "../common/datos/services/jugadoresService";
import { MediaComponent } from '../mediaComponent/mediaComponent';
import { toSignal } from "@angular/core/rxjs-interop";
import { AddPlayerComponent } from '../addPlayerComponent/addPlayerComponent';

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
  imports: [CommonModule, MediaComponent, AddPlayerComponent],
  templateUrl: './detailComponent.html',
  styleUrl: './detailComponent.css'
})
export class DetailComponent {
  private jugadoresService = inject(JugadoresService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showEdit = signal(false);

  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  private routeParams = toSignal(this.route.paramMap);

  readonly player = computed(() => {
    const nombre = this.routeParams()?.get('nombre');
    if (!nombre) return undefined;
    
    return this.players().find(j => j.nombre === nombre) as Player | undefined;
  });

  constructor() {
  }

  async deletePlayer(player: any) {
    if (!player) return;
    const ok = confirm(`¿Eliminar jugador "${player.nombre}"? Esta acción no se puede deshacer.`);
    if (!ok) return;
    try {
      if (!player.id) {
        console.error('No se encontró id del jugador, no se puede eliminar.');
        return;
      }
      await this.jugadoresService.deleteJugador(player.id);
      // Volver a la lista principal
      this.router.navigate(['/']);
    } catch (err) {
      console.error('Error eliminando jugador:', err);
      alert('No se pudo eliminar el jugador. Revisa la consola.');
    }
  }

  toggleShowEdit(): void {
    this.showEdit.set(!this.showEdit());
  }
}