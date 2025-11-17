<template>
  <!-- Contenedor principal del listado -->
  <div class="contenedor-lista">
    <h2 class="titulo-seccion">Listado de incidencias</h2>

    <!-- Barra de filtros y orden -->
    <div class="barra-orden">
      <!-- FILTRO POR EDIFICIO -->
      <div class="filtro-edificio">
        <label for="filtro-edificio">Edificio:</label>
        <select
          id="filtro-edificio"
          v-model="filtroEdificio"
          class="select-orden"
        >
          <option value="">Todos los edificios</option>
          <option
            v-for="ed in edificiosDisponibles"
            :key="ed"
            :value="ed"
          >
            {{ ed }}
          </option>
        </select>
      </div>

      <!-- ORDEN -->
      <div class="orden-wrapper">
        <div class="orden-campo">
          <label for="campo-orden">Ordenar por:</label>
          <select
            id="campo-orden"
            v-model="campoOrden"
            class="select-orden"
          >
            <option value="fecha">Fecha</option>
            <option value="estado">Estado</option>
          </select>
        </div>

        <button
          type="button"
          class="boton-orden"
          @click="toggleOrden"
        >
          {{ textoOrden }}
        </button>
      </div>
    </div>

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
          <!-- Recorremos las incidencias filtradas y ordenadas -->
          <tr
            v-for="(incidencia, index) in incidenciasOrdenadas"
            :key="incidencia.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ incidencia.edificio }}</td>
            <td>{{ incidencia.aula }}</td>
            <td>{{ incidencia.fecha }}</td>
            <td>
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

// FILTRO por edificio
const filtroEdificio = ref("");

// campo y dirección de orden
const campoOrden = ref("fecha"); // 'fecha' | 'estado'
const ordenAscendente = ref(false); // false = desc, true = asc

// texto para el botón de orden
const textoOrden = computed(() =>
  ordenAscendente.value ? "Ascendente ↑" : "Descendente ↓"
);

// alternar asc/desc
const toggleOrden = () => {
  ordenAscendente.value = !ordenAscendente.value;
};

// Suscripción a cambios de incidencias
const cargarIncidencias = () => {
  escucharIncidencias((lista) => (incidencias.value = lista));
};

// Distintos edificios disponibles en las incidencias (para el filtro)
const edificiosDisponibles = computed(() => {
  const set = new Set(
    incidencias.value
      .map((i) => i.edificio)
      .filter((e) => e && e.trim() !== "")
  );
  return Array.from(set).sort();
});

// Incidencias filtradas por edificio
const incidenciasFiltradas = computed(() => {
  if (!filtroEdificio.value) return incidencias.value;

  return incidencias.value.filter(
    (inc) => inc.edificio === filtroEdificio.value
  );
});

// Incidencias filtradas + ordenadas
const incidenciasOrdenadas = computed(() => {
  const campo = campoOrden.value; // 'fecha' o 'estado'
  const asc = ordenAscendente.value;

  return [...incidenciasFiltradas.value].sort((a, b) => {
    const aVal = (a[campo] || "").toString();
    const bVal = (b[campo] || "").toString();
    const cmp = aVal.localeCompare(bVal);
    return asc ? cmp : -cmp;
  });
});

// Al montar el componente cargamos/escuchamos incidencias
onMounted(cargarIncidencias);

// Si cambia la bandera de recarga, volvemos a escuchar
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

/* Barra de filtro + orden */
.barra-orden {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 0.5rem;
}

.filtro-edificio,
.orden-campo {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #475569;
}

.orden-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.select-orden {
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 0.25rem 0.6rem;
  font-size: 0.85rem;
  background-color: #f8fafc;
}

.boton-orden {
  border-radius: 999px;
  border: 1px solid #cbd5e1;
  padding: 0.25rem 0.7rem;
  font-size: 0.85rem;
  background-color: #e5e7eb;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}

.boton-orden:hover {
  background-color: #d4d4d8;
  transform: translateY(-1px);
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

/* Etiqueta de estado (base = amarillo) */
.estado {
  padding: 0.3rem 0.6rem;
  border-radius: 8px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: #fef9c3;
  border: 1px solid #facc15;
  color: #854d0e;
}

/* Colores por estado */
.estado.abierta_resuelta {
  background-color: #d1fae5;
  border-color: #10b981;
  color: #065f46;
}

.estado.cerrada {
  background-color: #fee2e2;
  border-color: #dc2626;
  color: #7f1d1d;
}
</style>
