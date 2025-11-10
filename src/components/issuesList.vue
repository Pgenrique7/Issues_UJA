<template>
  <div class="contenedor-lista">
    <h2 class="titulo-seccion">Listado de incidencias</h2>

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
          <tr v-for="(incidencia, index) in incidenciasOrdenadas" :key="incidencia.id">
            <td>{{ index + 1 }}</td>
            <td>{{ incidencia.edificio }}</td>
            <td>{{ incidencia.aula }}</td>
            <td>{{ incidencia.fecha }}</td>
            <td>
              <span :class="['estado', incidencia.estado]">{{ incidencia.estado }}</span>
            </td>
          </tr>
          <tr v-if="!incidenciasOrdenadas.length">
            <td colspan="5" class="sin-datos">No hay incidencias registradas</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { escucharIncidencias } from "../services/issuesService";

const props = defineProps({ banderaRecarga: Number });
const incidencias = ref([]);

const cargarIncidencias = () => {
  escucharIncidencias((lista) => (incidencias.value = lista));
};

const incidenciasOrdenadas = computed(() =>
  [...incidencias.value].sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""))
);

onMounted(cargarIncidencias);
watch(() => props.banderaRecarga, cargarIncidencias);
</script>

<style scoped>
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

.tabla-wrapper {
  max-height: 400px;
  overflow-y: auto;
  width: 100%;
}

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

.sin-datos {
  color: #94a3b8;
  text-align: center;
  padding: 1rem;
}

/* Estados */
.estado {
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-weight: 500;
  text-transform: capitalize;
}

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
