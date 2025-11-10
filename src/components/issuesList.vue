<template>
  <!-- Contenedor principal del listado -->
  <div class="contenedor-lista">
    <h2 class="titulo-seccion">Listado de incidencias</h2>

    <!-- Contenedor con scroll para la tabla -->
    <div class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th>#</th>
            <th>Edificio</th>
            <th>Aula</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <!-- Recorremos las incidencias ya ordenadas -->
          <tr
            v-for="(incidencia, index) in incidenciasOrdenadas"
            :key="incidencia.id"
          >
            <!-- Índice humanizado (empezando en 1) -->
            <td>{{ index + 1 }}</td>
            <td>{{ incidencia.edificio }}</td>
            <td>{{ incidencia.aula }}</td>
            <td>{{ incidencia.fecha }}</td>
            <td>
              <!-- Clase dinámica según el estado para colorear la etiqueta -->
              <span :class="['estado', incidencia.estado]">
                {{ incidencia.estado }}
              </span>
            </td>
          </tr>

          <!-- Fila de “sin datos” si no hay incidencias -->
          <tr v-if="!incidenciasOrdenadas.length">
            <td colspan="5" class="sin-datos">
              No hay incidencias registradas
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { escucharIncidencias } from "../services/issuesService";

// Recibimos una bandera numérica para forzar recargas desde el padre
const props = defineProps({ banderaRecarga: Number });

// Lista reactiva de incidencias
const incidencias = ref([]);

// Función que suscribe el componente a los cambios de incidencias
const cargarIncidencias = () => {
  // escucharIncidencias usa un callback al que le pasa la lista actualizada
  escucharIncidencias((lista) => (incidencias.value = lista));
};

// Computed que devuelve las incidencias ordenadas por fecha descendente
const incidenciasOrdenadas = computed(() =>
  [...incidencias.value].sort((a, b) =>
    (b.fecha || "").localeCompare(a.fecha || "")
  )
);

// Al montar el componente cargamos/escuchamos incidencias
onMounted(cargarIncidencias);

// Si cambia la bandera de recarga, volvemos a llamar a cargarIncidencias
watch(
  () => props.banderaRecarga,
  cargarIncidencias
);
</script>

<style scoped>
/* Layout general del listado */
.contenedor-lista {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.titulo-seccion {
  font-size: 1.4rem;
  color: #1e40af;
  margin-bottom: 1rem;
}

/* Contenedor con altura máxima y scroll vertical */
.tabla-wrapper {
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
}

/* Estilos base de la tabla */
.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

th,
td {
  border: 1px solid #e2e8f0;
  padding: 0.6rem 1rem;
  text-align: center;
}

th {
  background-color: #eff6ff;
  color: #1e40af;
}

/* Fila de mensaje cuando no hay datos */
.sin-datos {
  color: #94a3b8;
  text-align: center;
  padding: 1rem;
}

/* Etiqueta de estado */
.estado {
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-weight: 500;
  text-transform: capitalize;
}

/* Colores por estado */
.estado.pendiente {
  background-color: #fef3c7;
  color: #92400e;
}

.estado.en_proceso {
  background-color: #dbeafe;
  color: #1e40af;
}

.estado.cerrada {
  background-color: #dcfce7;
  color: #166534;
}
</style>
