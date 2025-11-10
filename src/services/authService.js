import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

export function iniciarSesion(correo, contrasena) {
  return signInWithEmailAndPassword(auth, correo, contrasena);
}

export function cerrarSesion() {
  return signOut(auth);
}

export function escucharCambiosSesion(callback) {
  return onAuthStateChanged(auth, callback);
}
