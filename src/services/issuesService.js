import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const coleccionIncidencias = collection(db, "incidencias");

/**
 * Crea una nueva incidencia en Firestore.
 */
export function crearIncidencia(datosIncidencia) {
  return addDoc(coleccionIncidencias, {
    ...datosIncidencia,
    creadaEn: serverTimestamp(),
  });
}

/**
 * Escucha todas las incidencias y ejecuta el callback cada vez que cambian.
 */
export function escucharIncidencias(callback) {
  const consulta = query(coleccionIncidencias, orderBy("creadaEn", "desc"));
  return onSnapshot(consulta, (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lista);
  });
}
