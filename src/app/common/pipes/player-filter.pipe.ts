import { Pipe, PipeTransform } from '@angular/core';

function normalize(text: any): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

@Pipe({
  name: 'playerFilter',
  standalone: true,
})
export class PlayerFilterPipe implements PipeTransform {
  transform(players: any[] | null | undefined, searchText?: string, filterField?: string): any[] {
    if (!players) return [];

    const text = searchText ?? '';
    if (text.trim() === '') return players;

    const normalizedSearch = normalize(text);

    const fieldMap: Record<string, string> = {
      'Nombre': 'nombre',
      'Equipo': 'equipo',
      'Posición': 'posicion',
      'Edad': 'edad',
      'Altura': 'altura',
    };

    const prop = fieldMap[filterField ?? 'Nombre'] || 'nombre';

    return players.filter(player => {
      const value = player?.[prop];
      if (value === undefined || value === null) return false;
      return normalize(String(value)).includes(normalizedSearch);
    });
  }
}
