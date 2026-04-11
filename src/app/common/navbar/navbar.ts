import { Component, inject, signal } from "@angular/core";
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from "@angular/router";
import { filter } from "rxjs/operators";
import { toSignal } from "@angular/core/rxjs-interop";
import { searchTextSignal, filterFieldSignal, showAddSignal } from '../state/search-state';
import { LabelPipe } from '../pipes/label.pipe';

@Component({
  selector: "navbar",
  standalone: true,
  imports: [RouterLink, LabelPipe, RouterLinkActive],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
})
export class Navbar {
    private router = inject(Router);

    currentUrl = toSignal(
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        )
    );

    isHome(): boolean {
        return this.router.url === '/' || this.router.url === '/home';
    }
        readonly searchText = searchTextSignal;
        readonly filterField = filterFieldSignal;

    
        async irAInicio() {
            console.log('Navegando a Inicio y reiniciando estado...');
        // 1. Reiniciamos el estado de búsqueda
                
        searchTextSignal.set('');
        filterFieldSignal.set('Nombre');
        showAddSignal.set(false);

        // 2. Navegamos a una ruta inexistente y volvemos rápido
        // Esto fuerza a Angular a reiniciar todos los componentes
        await this.router.navigate(['/']);
        this.router.navigate(['/']);
        window.location.href = '/'; // Forzamos recarga completa para asegurar estado limpio
        }

        crearDesdeNav(): void {
         if(!this.isHome()) {
            this.irAInicio();
            }
        }
}