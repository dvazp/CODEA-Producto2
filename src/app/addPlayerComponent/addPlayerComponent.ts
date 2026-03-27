import { Component, EventEmitter, Output, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JugadoresService } from '../common/datos/services/jugadoresService';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addPlayerComponent.html',
  styleUrl: './addPlayerComponent.css'
})
export class AddPlayerComponent {
  @Output() close = new EventEmitter<void>();
  @Input() set player(value: any) {
    if (value) {
      // clone to avoid mutating parent object
      this.jugador = { ...value };
    } else {
      this.jugador = { nombre: '', img: '', vid: '', altura: '', edad: '', equipo: '', posicion: '', aPP: '', pPP: '', rPP: '', porcentajeTiros: '' };
    }
  }

  jugador = { nombre: '', img: '' } as any;
  saving = signal(false);
  error: string | null = null;

  private jugadoresService = inject(JugadoresService);

  async save() {
    this.error = null;
    if (!this.jugador.nombre || this.jugador.nombre.trim().length === 0) {
      this.error = 'El nombre es obligatorio.';
      return;
    }
    this.saving.set(true);
    try {
      const payload: any = {
        nombre: this.jugador.nombre.trim(),
        img: this.jugador.img?.trim() || '',
        vid: this.jugador.vid?.trim(),
        altura: this.jugador.altura,
        edad: this.jugador.edad,
        equipo: this.jugador.equipo,
        posicion: this.jugador.posicion,
        aPP: this.jugador.aPP,
        pPP: this.jugador.pPP,
        rPP: this.jugador.rPP,
        porcentajeTiros: this.jugador.porcentajeTiros
      };

      // Si tenemos ID, actualizar; si no, crear nuevo
      if (this.jugador.id) {
        await this.jugadoresService.updateJugador(this.jugador.id, payload);
      } else {
        await this.jugadoresService.addJugador(payload);
      }

      this.jugador = { nombre: '', img: '', vid: '', altura: '', edad: '', equipo: '', posicion: '', aPP: '', pPP: '', rPP: '', porcentajeTiros: '' };
      this.close.emit();
    } catch (err: any) {
      console.error('Error guardando jugador:', err);
      this.error = 'No se pudo guardar el jugador. Revisa la consola.';
    } finally {
      this.saving.set(false);
    }
  }

  cancel() {
    this.close.emit();
  }
}
