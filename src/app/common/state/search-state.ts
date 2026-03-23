import { signal } from '@angular/core';

export type PlayerFilterField = 'Nombre' | 'Equipo' | 'Posición' | 'Edad' | 'Altura';


export const searchTextSignal = signal<string>('');
export const filterFieldSignal = signal<PlayerFilterField>('Nombre');