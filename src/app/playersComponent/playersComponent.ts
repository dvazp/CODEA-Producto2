import { Component, inject, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerFilterPipe } from '../common/pipes/player-filter.pipe';
import { searchTextSignal, filterFieldSignal, PlayerFilterField } from '../common/state/search-state';
import { JugadoresService } from "../common/datos/services/jugadoresService";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink, PlayerFilterPipe],
  templateUrl: './playersComponent.html',
  styleUrl: './playersComponent.css'
})
export class PlayersComponent {
  protected readonly title = signal('CODEA - Jugadores');
  
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
    this.selectedPlayer = player;
  }

  constructor() {
    console.log('PlayersComponent initialized with title:', this.title());
    this.jugadoresService.getJugadores().subscribe({
      next: (res) => console.log('Resultado de Firebase:', res),
      error: (err) => console.error('ERROR de Firebase:', err)
    });
  }
}