<template>
  <!-- Contenedor principal del formulario de login -->
  <div class="contenedor-login">
    <h2 class="titulo-login">Iniciar sesión</h2>

    <!-- Formulario: evita el comportamiento por defecto y ejecuta manejarLogin -->
    <form @submit.prevent="manejarLogin" class="formulario-login">
      <!-- Campo para el correo electrónico -->
      <div class="campo-grupo">
        <label class="etiqueta">Correo electrónico</label>
        <input
          v-model="correo"
          type="email"
          class="campo"
          placeholder="tu@correo.com"
        />
      </div>

      <!-- Campo para la contraseña -->
      <div class="campo-grupo">
        <label class="etiqueta">Contraseña</label>
        <input
          v-model="contrasena"
          type="password"
          class="campo"
          placeholder="••••••••"
        />
      </div>

      <!-- Mensaje de error si hay algún fallo -->
      <p v-if="error" class="mensaje error">{{ error }}</p>

      <!-- Botón para enviar el formulario -->
      <button type="submit" class="boton">Entrar</button>

      <!-- Nota informativa debajo del formulario -->
      <p class="nota">
        Firebase Authentication.
      </p>
    </form>
  </div>
</template>

<script setup>
// Importamos reactividad y el servicio de autenticación
import { ref } from "vue";
import { iniciarSesion } from "../services/authService";

// Declaramos el evento que se emitirá cuando el login sea correcto
const emit = defineEmits(["sesion-iniciada"]);

// Campos reactivos para los inputs y mensajes de error
const correo = ref("");
const contrasena = ref("");
const error = ref("");

// Función principal que maneja el inicio de sesión
const manejarLogin = async () => {
  error.value = "";

  // Validación básica de campos vacíos
  if (!correo.value || !contrasena.value) {
    error.value = "Debes introducir correo y contraseña.";
    return;
  }

  try {
    // Llama al servicio Firebase (o similar) para autenticar al usuario
    const credencial = await iniciarSesion(correo.value, contrasena.value);

    // Si el login es correcto, se emite el evento con el usuario autenticado
    emit("sesion-iniciada", credencial.user);
  } catch (e) {
    // Si hay un error (credenciales incorrectas, etc.)
    error.value = "Usuario o contraseña incorrectos.";
  }
};
</script>

<style scoped>
/* Estructura general y espaciado del contenedor */
.contenedor-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Título principal */
.titulo-login {
  font-size: 1.3rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5rem;
  text-align: center;
}

/* Diseño del formulario */
.formulario-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Cada grupo (etiqueta + campo) */
.campo-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.etiqueta {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

/* Inputs de texto */
.campo {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

/* Efecto de foco */
.campo:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  outline: none;
}

/* Botón principal */
.boton {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  width: 100%;
  transition: background 0.2s ease, transform 0.1s ease;
}

.boton:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
}

/* Mensajes y notas */
.mensaje {
  font-size: 0.9rem;
}

.error {
  color: #dc2626;
}

.nota {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: center;
}
</style>
