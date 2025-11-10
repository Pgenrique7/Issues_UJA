<template>
  <div v-if="!usuario" class="login-page">
    <div class="login-card">
      <h1 class="titulo-principal">Gestión de Incidencias UJA</h1>
      <loginForm @sesion-iniciada="manejarSesionIniciada" />
    </div>
  </div>

  <div v-else class="main-page">
    <div class="app-wrapper">
      <header class="barra-superior">
        <h1 class="titulo-app">Gestión de Incidencias UJA</h1>
        <div class="usuario-info">
          <span class="usuario-correo">Sesión: {{ usuario.email }}</span>
          <button class="btn-salir" @click="manejarCerrarSesion">
            Cerrar sesión
          </button>
        </div>
      </header>

      <main class="contenido">
        <section class="panel panel-form">
          <issuesForm @incidencia-creada="forzarRecarga" />
        </section>

        <section class="panel panel-lista">
          <issuesList :bandera-recarga="banderaRecarga" />
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { escucharCambiosSesion, cerrarSesion } from "./services/authService";

import loginForm from "./components/loginForm.vue";
import issuesForm from "./components/issuesForm.vue";
import issuesList from "./components/issuesList.vue";

const usuario = ref(null);
const banderaRecarga = ref(0);

const manejarSesionIniciada = (u) => {
  usuario.value = u;
};

const forzarRecarga = () => {
  banderaRecarga.value++;
};

const manejarCerrarSesion = async () => {
  await cerrarSesion();
  usuario.value = null;
};

onMounted(() => {
  escucharCambiosSesion((u) => {
    usuario.value = u || null;
  });
});
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: linear-gradient(135deg, #e0ecff, #f4f8ff);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>

<style scoped>
.login-page {
  height: 100vh;             
  width: 100vw;
  display: flex;
  justify-content: center;    
  align-items: center;        
  background: linear-gradient(135deg, #e0ecff, #f4f8ff);
  padding: 2rem;
}

.login-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
}

.titulo-principal {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #1e293b;
  margin-bottom: 1.8rem;
}

.main-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(135deg, #e0ecff, #f4f8ff);
  padding: 2rem 0;
}

.app-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.barra-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titulo-app {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.usuario-correo {
  font-size: 0.9rem;
  color: #475569;
}

.btn-salir {
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.btn-salir:hover {
  background-color: #fee2e2;
  transform: translateY(-1px);
}

.contenido {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.panel {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.8rem;
}

.panel-form {
  flex: 0 0 38%;
  min-width: 320px;
}

.panel-lista {
  flex: 1 1 60%;
  min-width: 420px;
}

@media (max-width: 900px) {
  .contenido {
    flex-direction: column;
  }

  .panel-form,
  .panel-lista {
    flex: 1 1 100%;
    min-width: 100%;
  }

  .barra-superior {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .app-wrapper {
    padding: 0 1rem;
  }
}
</style>
