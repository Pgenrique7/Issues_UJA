<template>
  <div class="contenedor-form">
    <h2 class="titulo-seccion">Nueva incidencia</h2>
    <p class="texto-ayuda">
      Completa los datos del aula y describe brevemente el problema.
    </p>

    <form @submit.prevent="guardarIncidencia" class="formulario">
      <div class="fila-doble">
        <div class="campo-grupo">
          <label class="etiqueta">Edificio</label>
          <input
            v-model="formulario.edificio"
            class="campo"
            placeholder="Ej: B4"
          />
        </div>

        <div class="campo-grupo">
          <label class="etiqueta">Aula</label>
          <input
            v-model="formulario.aula"
            class="campo"
            placeholder="Ej: 1.15"
          />
        </div>
      </div>

      <div class="fila-doble">
        <div class="campo-grupo">
          <label class="etiqueta">Fecha</label>
          <input v-model="formulario.fecha" type="date" class="campo" />
        </div>

        <div class="campo-grupo">
          <label class="etiqueta">Estado</label>
          <select v-model="formulario.estado" class="campo">
            <option value="">Selecciona…</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>
      </div>

      <div class="campo-grupo">
        <label class="etiqueta">Descripción</label>
        <textarea
          v-model="formulario.descripcion"
          rows="3"
          class="campo campo-textarea"
          placeholder="Describe el problema (equipos, conexión, proyector...)"
        ></textarea>
      </div>

      <div class="acciones">
        <button type="submit" class="boton">Crear incidencia</button>
      </div>

      <p v-if="error" class="mensaje error">{{ error }}</p>
      <p v-if="exito" class="mensaje exito">
        ✅ Incidencia creada correctamente
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { crearIncidencia } from "../services/issuesService";

const emit = defineEmits(["incidencia-creada"]);

const formulario = ref({
  edificio: "",
  aula: "",
  fecha: "",
  estado: "",
  descripcion: "",
});

const error = ref("");
const exito = ref(false);

const validar = () => {
  if (
    !formulario.value.edificio ||
    !formulario.value.aula ||
    !formulario.value.fecha ||
    !formulario.value.estado ||
    !formulario.value.descripcion
  ) {
    error.value = "Todos los campos son obligatorios.";
    return false;
  }
  return true;
};

const guardarIncidencia = async () => {
  error.value = "";
  exito.value = false;
  if (!validar()) return;
  try {
    await crearIncidencia(formulario.value);
    exito.value = true;
    emit("incidencia-creada");
    formulario.value = {
      edificio: "",
      aula: "",
      fecha: "",
      estado: "",
      descripcion: "",
    };
  } catch (e) {
    error.value = "Error al guardar la incidencia.";
  }
};
</script>

<style scoped>
.contenedor-form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.titulo-seccion {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
}

.texto-ayuda {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.8rem;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.fila-doble {
  display: flex;
  gap: 0.8rem;
}

.campo-grupo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.etiqueta {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

.campo {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.45rem 0.45rem;
  font-size: 0.9rem;
  background-color: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.campo:focus {
  border-color: #2563eb;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
}

.campo-textarea {
  resize: vertical;
  min-height: 80px;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.boton {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-weight: 500;
  border: none;
  border-radius: 999px;
  padding: 0.55rem 1.6rem;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.boton:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.45);
}

.mensaje {
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

.error {
  color: #dc2626;
}

.exito {
  color: #16a34a;
}

/* Responsive */
@media (max-width: 600px) {
  .fila-doble {
    flex-direction: column;
  }
}
</style>
