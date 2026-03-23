import { Component, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { infoJugadores } from '../common/datos/infoJugadores';
import { MediaComponent } from '../mediaComponent/mediaComponent';
import { PlayerFilterPipe } from '../common/pipes/player-filter.pipe';
import { searchTextSignal, filterFieldSignal, PlayerFilterField } from '../common/state/search-state';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink, PlayerFilterPipe],
  templateUrl: './playersComponent.html',
  styleUrl: './playersComponent.css'
})
export class PlayersComponent {
  protected readonly title = signal('CODEA-Producto1');

  readonly players = infoJugadores;

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
  }
}