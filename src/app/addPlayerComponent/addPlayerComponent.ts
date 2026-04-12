import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JugadoresService } from '../common/services/jugadoresService';
import { uploadImg, uploadVid } from '../common/funcionesAux/supabaseStorage';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addPlayerComponent.html',
  styleUrl: './addPlayerComponent.css', // Asegúrate de copiar los estilos de detail.css aquí
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AddPlayerComponent {
  @Output() close = new EventEmitter<void>();
  // Inicializamos un objeto vacío con la estructura de Player
  jugador = {
    nombre: '', equipo: '', posicion: '', altura: '', edad: 0,
    pPP: 0, rPP: 0, aPP: 0, porcentajeTiros: 0,
    img: 'assets/placeholder-player.png',
    vid: null
  } as any;

  // Para manejar los archivos antes de subir a Supabase
  selectedImgFile: File | null = null;
  selectedVidFile: File | null = null;
  
  previewImg: string | null = null;
  previewVid: string | ArrayBuffer | null = null;
  saving = signal(false);
  error: string | null = null;

  private jugadoresService = inject(JugadoresService);

  handleFile(event: any, type: 'img' | 'video') {
  event.preventDefault();
  event.stopPropagation();

  const file = event.type === 'drop' 
    ? event.dataTransfer?.files[0] 
    : event.target.files[0];

  if (!file) return;

  if (type === 'img') {
    this.selectedImgFile = file;
  } else {
    this.selectedVidFile = file;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    if (type === 'img') {
      this.previewImg = e.target.result;
    } else {
      this.previewVid = e.target.result; 
    }
  };
  reader.readAsDataURL(file);
}

  isFormValid(): boolean {
    return !!(this.jugador.nombre && this.selectedImgFile);
  }

  async save() {
    if (!this.jugador.nombre) {
      this.error = "El nombre es obligatorio";
      return;
    }
    if (!this.selectedImgFile) {
      this.error = "Se requiere subir una foto";
      return;
    }
    this.saving.set(true);
    try {
      // Subir archivos y obtener URLs
      const imgUrl = this.selectedImgFile ? await uploadImg(this.selectedImgFile) : '';
      const vidUrl = this.selectedVidFile ? await uploadVid(this.selectedVidFile) : '';

      const payload = { ...this.jugador, img: imgUrl, vid: vidUrl };
      await this.jugadoresService.addJugador(payload);
      this.close.emit();
    } catch (err) {
      this.error = "Error al guardar el jugador";
    } finally {
      this.saving.set(false);
    }
  }


  validateNumber(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    // Permitir números (48-57) y el punto (46)
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  cancel() { this.close.emit(); }
}