<template>
  <!-- Navbar -->
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar
          :sticky="true"
          :action="{
            route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
            color: 'bg-gradient-success',
          }"
        />
      </div>
    </div>
  </div>

  <!-- Main Section -->
  <section class="py-7">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <!-- Header Principal -->
          <div class="card">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                <div class="d-flex align-items-center">
                  <h3 class="text-white font-weight-bolder mt-2 mb-0 flex-grow-1">
                    <i class="fas fa-chart-bar me-2"></i>
                    Centro de Reportes
                  </h3>
                  <div class="ms-auto">
                    <MaterialBadge 
                      color="light" 
                      variant="contained" 
                      size="sm" 
                      badgeContent="Administrador"
                    />
                  </div>
                </div>
                <p class="text-white opacity-8 mb-0 mt-1">
                  Genera y descarga reportes de fumigaciones e historial de consumo en formato PDF y Excel
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Guía de Uso -->
      <div class="row mt-4">
        <div class="col-12">
          <ReportGuide />
        </div>
      </div>

      <!-- Reportes de Fumigaciones -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-info shadow-info border-radius-lg p-3">
                <h4 class="text-white font-weight-bolder mb-0">
                  <i class="fas fa-bug me-2"></i>
                  Reportes de Fumigaciones
                </h4>
                <p class="text-white opacity-8 mb-0 text-sm">
                  Genera reportes de solicitudes de fumigación con filtros personalizados
                </p>
              </div>
            </div>
            <div class="card-body">
              <!-- Filtros para Fumigaciones -->
              <div class="row mb-4">
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">Fecha Inicio</label>
                    <input
                      v-model="fumigationFilters.start_date"
                      type="date"
                      class="form-control border"
                    />
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">Fecha Fin</label>
                    <input
                      v-model="fumigationFilters.end_date"
                      type="date"
                      class="form-control border"
                    />
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">Estado</label>
                    <input
                      v-model="fumigationFilters.status"
                      type="text"
                      class="form-control border"
                      placeholder="Ej: Pendiente, Completado"
                    />
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">ID Cliente</label>
                    <input
                      v-model="fumigationFilters.client_id"
                      type="number"
                      class="form-control border"
                      placeholder="ID del cliente"
                    />
                  </div>
                </div>
              </div>

              <!-- Botones de descarga para Fumigaciones -->
              <div class="row">
                <div class="col-12">
                  <div class="text-center">
                    <MaterialButton
                      color="info"
                      variant="gradient"
                      size="lg"
                      class="me-2 mb-2"
                      @click="downloadFumigationPDF"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-file-pdf me-2"></i>
                      {{ isLoading ? "Generando..." : "Descargar PDF" }}
                    </MaterialButton>
                    
                    <MaterialButton
                      color="success"
                      variant="gradient"
                      size="lg"
                      class="me-2 mb-2"
                      @click="downloadFumigationExcel"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-file-excel me-2"></i>
                      {{ isLoading ? "Generando..." : "Descargar Excel" }}
                    </MaterialButton>
                    
                    <MaterialButton
                      color="secondary"
                      variant="outlined"
                      size="lg"
                      class="me-2 mb-2"
                      @click="viewFumigationJSON"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-eye me-2"></i>
                      Vista Previa
                    </MaterialButton>

                    <MaterialButton
                      color="warning"
                      variant="outlined"
                      size="lg"
                      class="mb-2"
                      @click="clearFumigationFilters"
                    >
                      <i class="fas fa-trash me-2"></i>
                      Limpiar Filtros
                    </MaterialButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reportes de Historial de Consumo -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-warning shadow-warning border-radius-lg p-3">
                <h4 class="text-white font-weight-bolder mb-0">
                  <i class="fas fa-boxes me-2"></i>
                  Reportes de Historial de Consumo
                </h4>
                <p class="text-white opacity-8 mb-0 text-sm">
                  Genera reportes de consumo de productos con análisis detallado
                </p>
              </div>
            </div>
            <div class="card-body">
              <!-- Filtros para Historial de Consumo -->
                            <!-- Filtros para Consumo de Material -->
              <div class="row mb-4">
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">Fecha Inicio</label>
                    <input
                      v-model="consumeFilters.start_date"
                      type="date"
                      class="form-control border"
                    />
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">Fecha Fin</label>
                    <input
                      v-model="consumeFilters.end_date"
                      type="date"
                      class="form-control border"
                    />
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">ID Material</label>
                    <input
                      v-model="consumeFilters.material_id"
                      type="number"
                      class="form-control border"
                      placeholder="ID del material"
                    />
                  </div>
                </div>
                <div class="col-lg-3 col-md-6">
                  <div class="form-group">
                    <label class="form-label text-dark font-weight-bold">ID Usuario</label>
                    <input
                      v-model="consumeFilters.user_id"
                      type="number"
                      class="form-control border"
                      placeholder="ID del usuario"
                    />
                  </div>
                </div>
              </div>

              <!-- Botones de descarga para Historial de Consumo -->
              <div class="row">
                <div class="col-12">
                  <div class="text-center">
                    <MaterialButton
                      color="warning"
                      variant="gradient"
                      size="lg"
                      class="me-2 mb-2"
                      @click="downloadConsumePDF"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-file-pdf me-2"></i>
                      {{ isLoading ? "Generando..." : "Descargar PDF" }}
                    </MaterialButton>
                    
                    <MaterialButton
                      color="success"
                      variant="gradient"
                      size="lg"
                      class="me-2 mb-2"
                      @click="downloadConsumeExcel"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-file-excel me-2"></i>
                      {{ isLoading ? "Generando..." : "Descargar Excel" }}
                    </MaterialButton>
                    
                    <MaterialButton
                      color="secondary"
                      variant="outlined"
                      size="lg"
                      class="me-2 mb-2"
                      @click="viewConsumeJSON"
                      :disabled="isLoading"
                    >
                      <i class="fas fa-eye me-2"></i>
                      Vista Previa
                    </MaterialButton>

                    <MaterialButton
                      color="dark"
                      variant="outlined"
                      size="lg"
                      class="mb-2"
                      @click="clearConsumeFilters"
                    >
                      <i class="fas fa-trash me-2"></i>
                      Limpiar Filtros
                    </MaterialButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Vista Previa -->
      <div 
        v-if="showPreview" 
        class="modal fade show d-block" 
        style="background-color: rgba(0, 0, 0, 0.5); z-index: 1055;"
        @click.self="closePreview"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered">
          <div class="modal-content">
            <div class="card">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-primary shadow-primary border-radius-lg p-3">
                  <div class="d-flex align-items-center">
                    <h4 class="text-white font-weight-bolder mb-0">
                      <i class="fas fa-chart-line me-2"></i>
                      Vista Previa del Reporte
                    </h4>
                    <button 
                      type="button" 
                      class="btn btn-link text-white ms-auto p-0"
                      @click="closePreview"
                    >
                      <i class="fas fa-times fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="modal-body p-4">
                <!-- Estadísticas -->
                <div class="row text-center mb-4">
                  <div class="col-md-4">
                    <div class="card card-plain">
                      <div class="card-body p-3">
                        <div class="d-flex">
                          <div class="icon icon-sm icon-shape bg-gradient-info shadow text-center border-radius-md ms-auto">
                            <i class="fas fa-list-ol text-white opacity-10"></i>
                          </div>
                        </div>
                        <h4 class="font-weight-bolder">
                          {{ previewData?.total_fumigations || previewData?.total_consumption_records || 0 }}
                        </h4>
                        <p class="mb-0 text-sm">Total de registros</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4" v-if="previewData?.total_products_used">
                    <div class="card card-plain">
                      <div class="card-body p-3">
                        <div class="d-flex">
                          <div class="icon icon-sm icon-shape bg-gradient-success shadow text-center border-radius-md ms-auto">
                            <i class="fas fa-boxes text-white opacity-10"></i>
                          </div>
                        </div>
                        <h4 class="font-weight-bolder">{{ previewData.total_products_used }}</h4>
                        <p class="mb-0 text-sm">Productos usados</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4" v-if="previewData?.total_cost">
                    <div class="card card-plain">
                      <div class="card-body p-3">
                        <div class="d-flex">
                          <div class="icon icon-sm icon-shape bg-gradient-warning shadow text-center border-radius-md ms-auto">
                            <i class="fas fa-dollar-sign text-white opacity-10"></i>
                          </div>
                        </div>
                        <h4 class="font-weight-bolder">${{ previewData.total_cost?.toFixed(2) }}</h4>
                        <p class="mb-0 text-sm">Costo total</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Datos JSON -->
                <div class="card">
                  <div class="card-body">
                    <h6 class="font-weight-bolder mb-3">Datos del Reporte:</h6>
                    <div style="max-height: 400px; overflow-y: auto;">
                      <pre class="bg-gray-100 p-3 border-radius-md">{{ JSON.stringify(previewData, null, 2) }}</pre>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer border-0">
                <MaterialButton
                  color="secondary"
                  variant="outlined"
                  @click="closePreview"
                >
                  <i class="fas fa-times me-2"></i>
                  Cerrar
                </MaterialButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div class="row mt-4" v-if="alert.show">
        <div class="col-12">
          <MaterialAlert
            :color="alert.type"
            :dismissible="true"
            @dismissed="alert.show = false"
          >
            <span class="text-white font-weight-bold">{{ alert.message }}</span>
          </MaterialAlert>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <DefaultFooter />
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import ReportService from "../data/ReportService";

// Example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

// Material components
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialBadge from "@/components/MaterialBadge.vue";
import MaterialAlert from "@/components/MaterialAlert.vue";
import ReportGuide from "@/components/ReportGuide.vue";

// Material input
import setMaterialInput from "@/assets/js/material-input";


// Estado de carga
const isLoading = ref(false);

// Estado de vista previa
const showPreview = ref(false);
const previewData = ref(null);

// Filtros para fumigaciones
const fumigationFilters = reactive({
  start_date: "",
  end_date: "",
  status: "",
  client_id: "",
});

// Filtros para historial de consumo
const consumeFilters = reactive({
  start_date: "",
  end_date: "",
  product_id: "",
  fumigation_id: "",
  product_type: "",
});

// Sistema de alertas
const alert = reactive({
  show: false,
  type: "success",
  message: "",
});

// Función para mostrar alertas
const showAlert = (type, message) => {
  alert.type = type;
  alert.message = message;
  alert.show = true;

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    alert.show = false;
  }, 5000);
};

// Funciones para limpiar filtros
const clearFumigationFilters = () => {
  Object.keys(fumigationFilters).forEach((key) => {
    fumigationFilters[key] = "";
  });
  showAlert("info", "Filtros de fumigaciones limpiados");
};

const clearConsumeFilters = () => {
  Object.keys(consumeFilters).forEach((key) => {
    consumeFilters[key] = "";
  });
  showAlert("info", "Filtros de consumo limpiados");
};

// Función para filtrar valores vacíos
const cleanFilters = (filters) => {
  const cleaned = {};
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
      cleaned[key] = filters[key];
    }
  });
  return cleaned;
};

// === FUNCIONES PARA REPORTES DE FUMIGACIONES ===

const downloadFumigationPDF = async () => {
  isLoading.value = true;
  try {
    const filters = cleanFilters(fumigationFilters);
    const result = await ReportService.downloadFumigationReportPDF(filters);
    showAlert("success", `Reporte PDF descargado: ${result.filename}`);
  } catch (error) {
    console.error("Error descargando PDF de fumigaciones:", error);
    showAlert("danger", error.message || "Error al descargar el reporte PDF");
  } finally {
    isLoading.value = false;
  }
};

const downloadFumigationExcel = async () => {
  isLoading.value = true;
  try {
    const filters = cleanFilters(fumigationFilters);
    const result = await ReportService.downloadFumigationReportExcel(filters);
    showAlert("success", `Reporte Excel descargado: ${result.filename}`);
  } catch (error) {
    console.error("Error descargando Excel de fumigaciones:", error);
    showAlert("danger", error.message || "Error al descargar el reporte Excel");
  } finally {
    isLoading.value = false;
  }
};

const viewFumigationJSON = async () => {
  isLoading.value = true;
  try {
    const filters = cleanFilters(fumigationFilters);
    const data = await ReportService.getFumigationReportJSON(filters);
    previewData.value = data;
    showPreview.value = true;
  } catch (error) {
    console.error("Error obteniendo vista previa de fumigaciones:", error);
    showAlert("danger", error.message || "Error al obtener vista previa");
  } finally {
    isLoading.value = false;
  }
};

// === FUNCIONES PARA REPORTES DE HISTORIAL DE CONSUMO ===

const downloadConsumePDF = async () => {
  isLoading.value = true;
  try {
    const filters = cleanFilters(consumeFilters);
    const result = await ReportService.downloadConsumeHistoryReportPDF(filters);
    showAlert("success", `Reporte PDF descargado: ${result.filename}`);
  } catch (error) {
    console.error("Error descargando PDF de consumo:", error);
    showAlert("danger", error.message || "Error al descargar el reporte PDF");
  } finally {
    isLoading.value = false;
  }
};

const downloadConsumeExcel = async () => {
  isLoading.value = true;
  try {
    const filters = cleanFilters(consumeFilters);
    const result = await ReportService.downloadConsumeHistoryReportExcel(filters);
    showAlert("success", `Reporte Excel descargado: ${result.filename}`);
  } catch (error) {
    console.error("Error descargando Excel de consumo:", error);
    showAlert("danger", error.message || "Error al descargar el reporte Excel");
  } finally {
    isLoading.value = false;
  }
};

const viewConsumeJSON = async () => {
  isLoading.value = true;
  try {
    const filters = cleanFilters(consumeFilters);
    const data = await ReportService.getConsumeHistoryReportJSON(filters);
    previewData.value = data;
    showPreview.value = true;
  } catch (error) {
    console.error("Error obteniendo vista previa de consumo:", error);
    showAlert("danger", error.message || "Error al obtener vista previa");
  } finally {
    isLoading.value = false;
  }
};

// Función para cerrar vista previa
const closePreview = () => {
  showPreview.value = false;
  previewData.value = null;
};

// Función para actualizar el estado de los inputs outline
const updateInputStates = () => {
  nextTick(() => {
    const inputs = document.querySelectorAll(".input-group-outline .form-control");
    inputs.forEach((input) => {
      if (input.value && input.value.trim() !== "") {
        input.classList.add("has-value");
      } else {
        input.classList.remove("has-value");
      }
    });
  });
};

// Watchers para detectar cambios en los filtros
watch(fumigationFilters, updateInputStates, { deep: true });
watch(consumeFilters, updateInputStates, { deep: true });

// Lifecycle
onMounted(() => {
  setMaterialInput();

  // Función para manejar el estado de los labels en inputs outline
  const handleInputOutline = () => {
    const inputs = document.querySelectorAll(
      ".input-group-outline .form-control"
    );
    inputs.forEach((input) => {
      const updateLabel = () => {
        if (input.value && input.value.trim() !== "") {
          input.classList.add("has-value");
        } else {
          input.classList.remove("has-value");
        }
      };

      // Ejecutar al cargar
      updateLabel();

      // Escuchar cambios
      input.addEventListener("input", updateLabel);
      input.addEventListener("change", updateLabel);
      input.addEventListener("blur", updateLabel);
    });
  };

  // Ejecutar después de que el DOM se haya actualizado
  setTimeout(handleInputOutline, 100);
});
</script>

<style scoped>
.bg-gray-100 {
  background-color: #f8f9fa !important;
}

.border-radius-md {
  border-radius: 0.5rem !important;
}

.icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-sm {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-shape {
  border-radius: 0.75rem;
}

.shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.card-plain {
  background: transparent;
  box-shadow: none;
}

.opacity-8 {
  opacity: 0.8;
}

.opacity-10 {
  opacity: 1;
}

pre {
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: none;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
  }
  
  .card-header .h3,
  .card-header h3 {
    font-size: 1.5rem;
  }
  
  .card-header .h4,
  .card-header h4 {
    font-size: 1.25rem;
  }
}
</style>