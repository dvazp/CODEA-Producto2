import { Component, inject, signal, effect, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { PlayerFilterPipe } from '../common/pipes/player-filter.pipe';
import { searchTextSignal, filterFieldSignal, PlayerFilterField, showAddSignal } from '../common/state/search-state';
import { JugadoresService } from "../common/services/jugadoresService";
import { toSignal } from "@angular/core/rxjs-interop";
import { AddPlayerComponent } from '../addPlayerComponent/addPlayerComponent';
import { DetailComponent } from '../detailComponent/detailComponent';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, PlayerFilterPipe, AddPlayerComponent, DetailComponent],
  templateUrl: './playersComponent.html',
  styleUrl: './playersComponent.css'
})
export class PlayersComponent implements OnInit {

  protected readonly title = signal('CODEA - Jugadores');
  readonly showAdd = showAddSignal;
 
  selectedPlayerId : string | null = null;
  selectedPlayer: any = null;
  
  private jugadoresService = inject(JugadoresService);
  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  private router = inject(Router);

  ngOnInit() {
    this.selectedPlayer = null;
  }

  get searchText(): string {
    return searchTextSignal();
  }

  get filterField(): PlayerFilterField {
    return filterFieldSignal();
  }


  selectPlayer(player: any): void {
    const grid = document.querySelector('.contenedor-grid');
    if (!grid) {
      if (this.selectedPlayer?.id === player.id) {
        this.selectedPlayer = null;
        this.selectedPlayerId = null;
      } else {
        this.selectedPlayer = player;
        this.selectedPlayerId = player.id; // Importante!!!
      }
      return;
    }

    const cols = Array.from(grid.querySelectorAll('.col')) as HTMLElement[];
    const firstRects = cols.map((el) => el.getBoundingClientRect());

    if (this.selectedPlayer && this.selectedPlayer.id === player.id) {
      this.selectedPlayer = null;
      this.selectedPlayerId = null;
    } else {
      this.selectedPlayer = player;
      this.selectedPlayerId = player.id;
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
console.log('PlayersComponent initialized');

  /*this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(()=> {
      const isHome = this.router.url ==='/' || this.router.url ==='/home';
      const isSearchEmpty = searchTextSignal() === '';
      
      if (isHome && !isSearchEmpty) {
      console.log('Navegando a Inicio, reiniciando estado...');
      this.selectedPlayer = null;
    }
  });
  */

  effect(() => {
    const list = this.players();
    const texto = searchTextSignal();

    if (texto === '' && !this.selectedPlayerId) {
      this.selectedPlayer = null;
      this.selectedPlayerId = null;
      return;
    }

    if (this.selectedPlayerId) {
      const updated = list.find((p: any) => p.id === this.selectedPlayerId);
      if (updated) {
        this.selectedPlayer = updated; 
      }
    }
  }, { allowSignalWrites: true });

    this.jugadoresService.getJugadores().subscribe({
      next: (res) => console.log('Resultado de Firebase:', res.length),
      error: (err) => console.error('ERROR de Firebase:', err)
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


