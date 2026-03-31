import { Component, inject, signal, effect } from "@angular/core";
import { CommonModule } from '@angular/common';
import { PlayerFilterPipe } from '../common/pipes/player-filter.pipe';
import { searchTextSignal, filterFieldSignal, PlayerFilterField, showAddSignal } from '../common/state/search-state';
import { JugadoresService } from "../common/services/jugadoresService";
import { toSignal } from "@angular/core/rxjs-interop";
import { AddPlayerComponent } from '../addPlayerComponent/addPlayerComponent';
import { DetailComponent } from '../detailComponent/detailComponent';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, PlayerFilterPipe, AddPlayerComponent, DetailComponent],
  templateUrl: './playersComponent.html',
  styleUrl: './playersComponent.css'
})
export class PlayersComponent {
  protected readonly title = signal('CODEA - Jugadores');
  readonly showAdd = showAddSignal;
  
  private jugadoresService = inject(JugadoresService);
  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });

  get searchText(): string {
    return searchTextSignal();
  }

  get filterField(): PlayerFilterField {
    return filterFieldSignal();
  }

  selectedPlayer: any = null;

  selectPlayer(player: any): void {
    const grid = document.querySelector('.contenedor-grid');
    if (!grid) {
      if (this.selectedPlayer && this.selectedPlayer.id === player.id) {
        this.selectedPlayer = null;
      } else {
        this.selectedPlayer = player;
      }
      return;
    }

    const cols = Array.from(grid.querySelectorAll('.col')) as HTMLElement[];
    const firstRects = cols.map((el) => el.getBoundingClientRect());

    if (this.selectedPlayer && this.selectedPlayer.id === player.id) {
      this.selectedPlayer = null;
    } else {
      this.selectedPlayer = player;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const lastRects = cols.map((el) => el.getBoundingClientRect());
        this.doFlip(cols, firstRects, lastRects);
      });
    });
  }

  toggleShowAdd(player: any = null): void {
    this.selectedPlayer = player;
    showAddSignal.set(!showAddSignal());
  }

  async borrar(id:string){
    if(confirm('Quieres eliminar el jugador?')){
      try {
        await this.jugadoresService.deleteJugador(id);
        console.log('Jugador eliminado');
      }catch(err){
        console.error('Error al borrar: ',err);
      }
    }
  }

  constructor() {
    console.log('PlayersComponent initialized with title:', this.title());
    this.jugadoresService.getJugadores().subscribe({
      next: (res) => console.log('Resultado de Firebase:', res),
      error: (err) => console.error('ERROR de Firebase:', err)
    });
    effect(() => {
      const list = this.players();
      if (this.selectedPlayer) {
        const updated = list.find((p: any) => p.id === this.selectedPlayer.id);
        if (updated) {
          this.selectedPlayer = updated;
        } else {
          this.selectedPlayer = null;
        }
      }
    });
  }


  // animación FLIP para las cartas del grid.
  // No es perfecta pero da un efecto de morphing bastante agradable al cambiar el layout.
  // demasiado esfuerzo para el resultado 😭
  private doFlip(elements: HTMLElement[], firstRects: DOMRect[], lastRects: DOMRect[]) {
    if (!elements || elements.length === 0) return;

    const duration = 360;
    const easing = 'cubic-bezier(.22,.9,.28,1)';

    elements.forEach((el, i) => {
      const first = firstRects[i];
      const last = lastRects[i];
      if (!first || !last) return;

      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      const scaleX = first.width / last.width || 1;
      const scaleY = first.height / last.height || 1;

      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5 && Math.abs(1 - scaleX) < 0.01 && Math.abs(1 - scaleY) < 0.01) {
        return;
      }

      el.style.transition = 'none';
      el.style.transformOrigin = 'top left';
      el.style.willChange = 'transform';
      el.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;

      el.getBoundingClientRect();

      el.style.transition = `transform ${duration}ms ${easing}`;
      el.style.transform = '';

      const cleanup = () => {
        el.style.transition = '';
        el.style.willChange = '';
        el.style.transformOrigin = '';
        el.removeEventListener('transitionend', cleanup);
      };
      el.addEventListener('transitionend', cleanup);
    });
  }
}