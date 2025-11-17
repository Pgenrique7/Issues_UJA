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
      <!-- Fila: Campus + Edificio (selects desde Firestore) -->
      <div class="fila-doble">
        <div class="campo-grupo">
          <label class="etiqueta">Campus</label>
          <select v-model="formulario.campus" class="campo">
            <option value="">Selecciona…</option>
            <option
              v-for="c in listaCampus"
              :key="c.id"
              :value="c.id"
            >
              <!-- en tu colección 'campus' el campo se llama 'description' -->
              {{ c.description || c.id }}
            </option>
          </select>
        </div>

        <div class="campo-grupo">
          <label class="etiqueta">Edificio</label>
          <select v-model="formulario.edificio" class="campo">
            <option value="">Selecciona…</option>
            <option
              v-for="e in listaEdificios"
              :key="e.id"
              :value="e.id"
            >
              <!-- en 'edificios' el campo se llama 'name' -->
              {{ e.id }}
            </option>
          </select>
        </div>
      </div>

      <!-- Fila: Aula + Equipamiento afectado -->
      <div class="fila-doble">
        <div class="campo-grupo">
          <label class="etiqueta">Aula</label>
          <input
            v-model="formulario.aula"
            class="campo"
            placeholder="Ej: 1.15"
          />
        </div>

        <div class="campo-grupo">
          <label class="etiqueta">Equipamiento afectado</label>
          <select v-model="formulario.equipamientoAfectado" class="campo">
            <option value="">Selecciona…</option>
            <option
              v-for="eq in listaEquipamiento"
              :key="eq.id"
              :value="eq.id"
            >
              <!-- en 'equipamiento' el campo es 'description' -->
              {{ eq.description  }}
            </option>
          </select>
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
            <option value="abierta_no_resuelta">Abierta, no resuelta</option>
            <option value="abierta_resuelta">Abierta, resuelta</option>
            <option value="abierta_servicio_externo">Abierta, servicio externo</option>
            <option value="abierta_tecnicos_uja">Abierta, Técnicos UJA</option>
            <option value="cerrada">Cerrada, imposible solucionar</option>
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
import { ref, onMounted } from "vue";
import { crearIncidencia } from "../services/issuesService";

// importa tu instancia de Firestore
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const emit = defineEmits(["incidencia-creada"]);

// objeto formulario con los nuevos campos
const formulario = ref({
  campus: "",
  edificio: "",
  aula: "",
  equipamientoAfectado: "",
  fecha: "",
  estado: "",
  descripcion: "",
});

// estados de mensajes
const error = ref("");
const exito = ref(false);

// listas para los desplegables
const listaCampus = ref([]);
const listaEdificios = ref([]);
const listaEquipamiento = ref([]);

// carga de datos desde Firestore
const cargarDatosSelects = async () => {
  try {
    // CAMPUS
    const campusSnap = await getDocs(collection(db, "campus"));
    listaCampus.value = campusSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // EDIFICIOS
    const edificiosSnap = await getDocs(collection(db, "edificios"));
    listaEdificios.value = edificiosSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // EQUIPAMIENTO
    const equipSnap = await getDocs(collection(db, "equipamiento"));
    listaEquipamiento.value = equipSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Error cargando datos de Firestore", e);
    error.value =
      "No se han podido cargar campus, edificios o equipamiento desde la base de datos.";
  }
};

// se ejecuta al montar el componente
onMounted(cargarDatosSelects);

// validación
const validar = () => {
  if (
    !formulario.value.campus ||
    !formulario.value.edificio ||
    !formulario.value.aula ||
    !formulario.value.equipamientoAfectado ||
    !formulario.value.fecha ||
    !formulario.value.estado ||
    !formulario.value.descripcion
  ) {
    error.value = "Todos los campos son obligatorios.";
    return false;
  }
  return true;
};

// envío
const guardarIncidencia = async () => {
  error.value = "";
  exito.value = false;

  if (!validar()) return;

  try {
    await crearIncidencia(formulario.value);

    exito.value = true;
    emit("incidencia-creada");

    // reset del formulario
    formulario.value = {
      campus: "",
      edificio: "",
      aula: "",
      equipamientoAfectado: "",
      fecha: "",
      estado: "",
      descripcion: "",
    };
  } catch (e) {
    console.error(e);
    error.value = "Error al guardar la incidencia.";
  }
};
</script>

<style scoped>
/* tus estilos exactamente igual que antes */
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

@media (max-width: 600px) {
  .fila-doble {
    flex-direction: column;
  }
}
</style>
