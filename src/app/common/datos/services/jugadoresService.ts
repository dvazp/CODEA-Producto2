import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JugadoresService {
  private firestore = inject(Firestore);

  getJugadores(): Observable<any[]> {
    return new Observable(subscriber => {
      const jugadoresRef = collection(this.firestore, 'jugadores');
      const q = query(jugadoresRef);

      // onSnapshot escucha cambios en la base de datos
      // Se ejecuta cada vez que algo cambia en Firebase
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const jugadores = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          subscriber.next(jugadores); // Enviamos los datos al componente
        }, 
        (error) => {
          subscriber.error(error); // Enviamos el error si ocurre
        }
      );
      return () => unsubscribe(); // Desuscribirse al observable cuando el componente se destruya (por lo que sea)
    });
  }
}