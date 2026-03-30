import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot, query, setDoc, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
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

  // Añade un nuevo jugador a la colección 'jugadores'
  addJugador(jugador: any): Promise<any> {
    const jugadorDocRef = doc(this.firestore, 'jugadores', jugador.nombre);
        return setDoc(jugadorDocRef, jugador);
  }

  // Elimina un jugador por id
  deleteJugador(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'jugadores', id);
    return deleteDoc(docRef);
  }

  // Actualiza un jugador por id con los campos proporcionados
  updateJugador(id: string, data: Partial<any>): Promise<void> {
    const docRef = doc(this.firestore, 'jugadores', id);
    return updateDoc(docRef, data);
  }
}