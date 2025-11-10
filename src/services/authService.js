import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ---- Función para iniciar sesión ----
// Recibe correo y contraseña, y llama al método de Firebase para autenticar.
// Devuelve una promesa con las credenciales del usuario si es correcto.
export function iniciarSesion(correo, contrasena) {
  return signInWithEmailAndPassword(auth, correo, contrasena);
}

// ---- Función para cerrar sesión ----
// Cierra la sesión actual del usuario en Firebase.
// También devuelve una promesa que se resuelve al completar el cierre.
export function cerrarSesion() {
  return signOut(auth);
}

// ---- Función para escuchar cambios en la sesión ----
// Permite detectar si el usuario inicia o cierra sesión.
// Ejecuta el callback cada vez que cambia el estado de autenticación.
// Devuelve una función para dejar de escuchar.
export function escucharCambiosSesion(callback) {
  return onAuthStateChanged(auth, callback);
}
