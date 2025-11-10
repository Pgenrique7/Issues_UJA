<template>
  <div class="contenedor-login">
    <h2 class="titulo-login">Iniciar sesión</h2>

    <form @submit.prevent="manejarLogin" class="formulario-login">
      <div class="campo-grupo">
        <label class="etiqueta">Correo electrónico</label>
        <input
          v-model="correo"
          type="email"
          class="campo"
          placeholder="tu@correo.com"
        />
      </div>

      <div class="campo-grupo">
        <label class="etiqueta">Contraseña</label>
        <input
          v-model="contrasena"
          type="password"
          class="campo"
          placeholder="••••••••"
        />
      </div>

      <p v-if="error" class="mensaje error">{{ error }}</p>

      <button type="submit" class="boton">Entrar</button>

      <p class="nota">
        Firebase Authentication.
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { iniciarSesion } from "../services/authService";

const emit = defineEmits(["sesion-iniciada"]);

const correo = ref("");
const contrasena = ref("");
const error = ref("");

const manejarLogin = async () => {
  error.value = "";

  if (!correo.value || !contrasena.value) {
    error.value = "Debes introducir correo y contraseña.";
    return;
  }

  try {
    const credencial = await iniciarSesion(correo.value, contrasena.value);
    emit("sesion-iniciada", credencial.user);
  } catch (e) {
    error.value = "Usuario o contraseña incorrectos.";
  }
};
</script>

<style scoped>
.contenedor-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.titulo-login {
  font-size: 1.3rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.5rem;
  text-align: center;
}

.formulario-login {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

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

.campo {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.55rem 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.campo:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  outline: none;
}

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
