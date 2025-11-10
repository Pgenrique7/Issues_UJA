<template>
  <!-- Contenedor principal del formulario -->
  <div class="contenedor-form">
    <!-- Título de la sección -->
    <h2 class="titulo-seccion">Nueva incidencia</h2>

    <!-- Texto de ayuda debajo del título -->
    <p class="texto-ayuda">
      Completa los datos del aula y describe brevemente el problema.
    </p>

    <!-- Formulario; se evita el submit por defecto y se ejecuta guardarIncidencia -->
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

      <!-- Segunda fila doble: Fecha y Estado -->
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

      <!-- Campo de descripción en textarea -->
      <div class="campo-grupo">
        <label class="etiqueta">Descripción</label>
        <textarea
          v-model="formulario.descripcion"
          rows="3"
          class="campo campo-textarea"
          placeholder="Describe el problema (equipos, conexión, proyector...)"
        ></textarea>
      </div>

      <!-- Contenedor de acciones (botón de enviar) -->
      <div class="acciones">
        <button type="submit" class="boton">Crear incidencia</button>
      </div>

      <!-- Mensaje de error si existe texto en error -->
      <p v-if="error" class="mensaje error">{{ error }}</p>
      <!-- Mensaje de éxito si exito es true -->
      <p v-if="exito" class="mensaje exito">
        ✅ Incidencia creada correctamente
      </p>
    </form>
  </div>
</template>

<script setup>
// Importamos ref para crear variables reactivas
import { ref } from "vue";
// Servicio que se encarga de enviar la incidencia al backend
import { crearIncidencia } from "../services/issuesService";

// Declaramos los eventos que puede emitir este componente
// En este caso, "incidencia-creada" se emite cuando se guarda correctamente
const emit = defineEmits(["incidencia-creada"]);

// Objeto reactivo que representa el formulario
const formulario = ref({
  edificio: "",
  aula: "",
  fecha: "",
  estado: "",
  descripcion: "",
});

// Estado reactivo para el mensaje de error (cadena vacía = sin error)
const error = ref("");
// Estado reactivo para indicar si la operación fue exitosa
const exito = ref(false);

// Función de validación básica del formulario
const validar = () => {
  // Comprobamos que todos los campos tengan algún valor
  if (
    !formulario.value.edificio ||
    !formulario.value.aula ||
    !formulario.value.fecha ||
    !formulario.value.estado ||
    !formulario.value.descripcion
  ) {
    // Si algún campo está vacío, se muestra este mensaje de error
    error.value = "Todos los campos son obligatorios.";
    return false;
  }
  // Si todo está correcto, devolvemos true
  return true;
};

// Función que se ejecuta al enviar el formulario
const guardarIncidencia = async () => {
  // Limpiamos mensajes previos
  error.value = "";
  exito.value = false;

  // Si la validación falla, salimos de la función
  if (!validar()) return;

  try {
    // Llamamos al servicio para crear la incidencia, enviando los datos del formulario
    await crearIncidencia(formulario.value);

    // Si no hay errores, marcamos éxito
    exito.value = true;

    // Emitimos evento para avisar al componente padre de que se ha creado una incidencia
    emit("incidencia-creada");

    // Reseteamos el formulario a los valores iniciales
    formulario.value = {
      edificio: "",
      aula: "",
      fecha: "",
      estado: "",
      descripcion: "",
    };
  } catch (e) {
    // Si algo falla en la petición, mostramos mensaje genérico de error
    error.value = "Error al guardar la incidencia.";
  }
};
</script>

<style scoped>
/* Estilos del contenedor principal del formulario */
.contenedor-form {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* Estilo del título de la sección */
.titulo-seccion {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
}

/* Texto de ayuda bajo el título */
.texto-ayuda {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.8rem;
}

/* Layout general del formulario */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

/* Fila con dos columnas (para escritorio) */
.fila-doble {
  display: flex;
  gap: 0.8rem;
}

/* Grupo de campo: etiqueta + input/select/textarea */
.campo-grupo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Estilo de las etiquetas de los campos */
.etiqueta {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

/* Estilo base de inputs, selects y textarea */
.campo {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.45rem 0.45rem;
  font-size: 0.9rem;
  background-color: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

/* Estilos cuando el campo está enfocado */
.campo:focus {
  border-color: #2563eb;
  background-color: #ffffff;
  outline: none;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
}

/* Ajustes específicos para el textarea */
.campo-textarea {
  resize: vertical;
  min-height: 80px;
}

/* Contenedor del botón de acción */
.acciones {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

/* Estilo del botón principal */
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

/* Efecto hover del botón */
.boton:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.45);
}

/* Estilo base para los mensajes (error / éxito) */
.mensaje {
  font-size: 0.85rem;
  margin-top: 0.2rem;
}

/* Mensaje de error en rojo */
.error {
  color: #dc2626;
}

/* Mensaje de éxito en verde */
.exito {
  color: #16a34a;
}

/* Responsive: en pantallas pequeñas las dos columnas pasan a una columna */
@media (max-width: 600px) {
  .fila-doble {
    flex-direction: column;
  }
}
</style>
