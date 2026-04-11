import { Component, computed, inject, signal, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JugadoresService } from "../common/services/jugadoresService";
import { MediaComponent } from '../mediaComponent/mediaComponent';
import { toSignal } from "@angular/core/rxjs-interop";
import { FormsModule } from '@angular/forms'

interface Player {
  id?: string;
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
  imports: [CommonModule, MediaComponent, FormsModule],
  templateUrl: './detailComponent.html',
  styleUrl: './detailComponent.css'
})
export class DetailComponent {
  private playerInputSignal = signal<Player | null | undefined>(undefined);
  @Input() set playerInput(value: Player | null | undefined) {
    try {
      const selectors = ['.custom-height-img', '.custom-card h2', '.stat-badge'];
      const elsBefore = Array.from(document.querySelectorAll(selectors.join(','))) as HTMLElement[];
      const firstRects = elsBefore.map((el) => el.getBoundingClientRect());

      this.playerInputSignal.set(value);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const elsAfter = Array.from(document.querySelectorAll(selectors.join(','))) as HTMLElement[];
          const lastRects = elsAfter.map((el) => el.getBoundingClientRect());
          this.runFlipOnElements(elsAfter, firstRects, lastRects);
        });
      });
      return;
    } catch (err) {
      this.playerInputSignal.set(value);
      return;
    }
  }
  get playerInput() {
    return this.playerInputSignal();
  }
  private jugadoresService = inject(JugadoresService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showEdit = signal(false);
  isEditing = signal(false);

  readonly players = toSignal(this.jugadoresService.getJugadores(), { initialValue: [] });
  private routeParams = toSignal(this.route.paramMap);

  readonly player = computed(() => {
    if (this.playerInput) return this.playerInput as Player;

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

  async saveChanges(player: any) {
  if (!player.id) return;
  try {
    await this.jugadoresService.updateJugador(player.id, player);

    this.isEditing.set(false); // Cerramos el modo edición

    console.log('Cambios guardados con éxito') //alert('Cambios guardados con éxito');
    
  } catch (err) {
    console.error('Error al actualizar:', err);
    // alert('Error al guardar los cambios');
  }
}

  toggleShowEdit(): void {
    this.showEdit.set(!this.showEdit());
  }

  // más animaciones que PARA NADA eran necesarias
  // pero oye ya había hecho algo así y he podido reaprovechar código, así que por qué no?? 👍🏿👍🏿👍🏿👍🏿
  private runFlipOnElements(elements: HTMLElement[], firstRects: DOMRect[], lastRects: DOMRect[]) {
    if (!elements || elements.length === 0) return;
    const duration = 360;
    const easing = 'cubic-bezier(.22,.9,.28,1)';

    elements.forEach((el, i) => {
      const first = firstRects[i];
      const last = lastRects[i];
      if (!first || !last) return;

      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = first.width / last.width || 1;
      const sy = first.height / last.height || 1;

      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(1 - sx) < 0.01 && Math.abs(1 - sy) < 0.01) return;

      el.style.transition = 'none';
      el.style.transformOrigin = 'top left';
      el.style.willChange = 'transform, opacity';
      el.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;

      el.getBoundingClientRect();

      el.style.transition = `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
      el.style.transform = '';
      el.style.opacity = '1';

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