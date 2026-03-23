import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'label',
  standalone: true,
})
export class LabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (value === null || value === undefined) return '';
    const s = String(value).toLocaleLowerCase('es-ES');
    const first = s.charAt(0).toLocaleUpperCase('es-ES');
    return first + s.slice(1);
  }
}
