<template>
  <div class="card mb-4 border-info">
    <div class="card-header bg-info text-white">
      <div class="d-flex align-items-center">
        <i class="fas fa-info-circle me-2"></i>
        <h6 class="mb-0">Guía de Uso del Centro de Reportes</h6>
        <button 
          class="btn btn-link text-white ms-auto p-0" 
          @click="toggleCollapse"
          type="button"
        >
          <i :class="collapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></i>
        </button>
      </div>
    </div>
    <div v-show="!collapsed" class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-info">📊 Reportes de Fumigaciones</h6>
          <ul class="small">
            <li><strong>Fecha Inicio/Fin:</strong> Filtra fumigaciones por rango de fechas</li>
            <li><strong>Estado:</strong> Filtra por estado (Pendiente, Completado, etc.)</li>
            <li><strong>ID Cliente:</strong> Ver fumigaciones de un cliente específico</li>
            <li><strong>Formatos:</strong> Descarga en PDF (reporte) o Excel (datos completos)</li>
          </ul>
        </div>
        <div class="col-md-6">
          <h6 class="text-success">📦 Reportes de Historial de Consumo</h6>
          <ul class="small">
            <li><strong>Fecha Inicio/Fin:</strong> Filtra consumos por período</li>
            <li><strong>ID Producto:</strong> Ver consumo de un producto específico</li>
            <li><strong>ID Fumigación:</strong> Ver productos usados en una fumigación</li>
            <li><strong>Tipo de Producto:</strong> Filtra por categoría (Insecticida, etc.)</li>
          </ul>
        </div>
      </div>
      
      <div class="row mt-3">
        <div class="col-12">
          <div class="alert alert-light border-start border-primary border-4 ps-3">
            <div class="d-flex">
              <i class="fas fa-lightbulb text-warning me-2 mt-1"></i>
              <div>
                <strong>Consejos:</strong>
                <ul class="mb-0 mt-1">
                  <li>Usa <strong>Vista Previa</strong> para verificar los datos antes de descargar</li>
                  <li>Los archivos PDF son ideales para presentaciones</li>
                  <li>Los archivos Excel permiten análisis adicional de datos</li>
                  <li>Deja los filtros vacíos para obtener todos los registros</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const collapsed = ref(false);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped>
.small {
  font-size: 0.875rem;
}

.border-start {
  border-left: 0.25rem solid !important;
}

.border-4 {
  border-width: 0.25rem !important;
}

.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: none;
}
</style>