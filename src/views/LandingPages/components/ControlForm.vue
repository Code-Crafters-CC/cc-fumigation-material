<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from '@/stores/index';
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

const EditIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M15.232 5.232l3.536 3.536M9 13.5V17h3.5l7.036-7.036a2.002 2.002 0 0 0 0-2.828l-3.672-3.672a2.002 2.002 0 0 0-2.828 0L9 7.5z" />
</svg>`;
const DeleteIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5-4h4a2 2 0 0 1 2 2v2H7V5a2 2 0 0 1 2-2zm-4 4h12"/>
</svg>`;

const store = useAppStore();
const listFumigations = ref([]);
const statusOptions = ref([]);

// Traducción de status_name a español
const statusTranslation = {
  "REQUESTED": "Solicitado",
  "IN_PROGRESS": "En progreso",
  "COMPLETED": "Completado",
  "CANCELLED": "Cancelado"
};

const editingId = ref(null);
const editingStatus = ref(""); // Aquí irá el id del status seleccionado

// Cargar status desde backend
const fetchStatusOptions = async () => {
  try {
    const res = await axios.get("/status/", {
      headers: { Authorization: `Bearer ${store.token.access}` }
    });
    statusOptions.value = res.data.map(s => ({
      value: s.id,
      label: statusTranslation[s.status_name] || s.status_name
    }));
  } catch (error) {
    console.log("Error cargando status:", error);
  }
};

const listarFumigaciones = async () => {
  try {
    const response = await axios.get("fumigationRequest/", {
      headers: { Authorization: `Bearer ${store.token.access}` }
    });
    listFumigations.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const startEdit = (fumigation) => {
  editingId.value = fumigation.id;
  editingStatus.value = fumigation.status; // status es el ID, no el nombre
};

const cancelEdit = () => {
  editingId.value = null;
  editingStatus.value = "";
};

const saveEdit = async (fumigationId) => {
  try {
    await axios.patch(`fumigationRequest/${fumigationId}/`, 
      { status: editingStatus.value },
      { headers: { Authorization: `Bearer ${store.token.access}` } }
    );
    editingId.value = null;
    editingStatus.value = "";
    await listarFumigaciones();
  } catch (error) {
    alert("No se pudo actualizar el status.");
    console.log(error);
  }
};

const deleteFumigation = async (fumigationId) => {
  if (!confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
  try {
    await axios.delete(`fumigationRequest/${fumigationId}/`, {
      headers: { Authorization: `Bearer ${store.token.access}` }
    });
    await listarFumigaciones();
  } catch (error) {
    alert("No se pudo eliminar la solicitud.");
    console.log(error);
  }
};

onMounted(async () => {
  await fetchStatusOptions();
  await listarFumigaciones();
});
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar :sticky="true" />
      </div>
    </div>
  </div>
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-10 d-flex flex-column mx-auto mt-4 mt-md-0">
            <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                style="margin-top: 60px; margin-left: 30px; padding: 50px 20px 15px 5px;">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                  <h3 class="text-white text-success mb-0">Solicitudes de Fumigación</h3>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive" style="max-height: 400px; overflow-y: auto; margin-top: 10px; margin-left: 15px;">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Cliente</th>
                        <th>Fecha solicitada</th>
                        <th>Dirección</th>
                        <th>Plaga</th>
                        <th>Status</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="lf in listFumigations" :key="lf.id">
                        <td>{{ lf.id }}</td>
                        <td>{{ lf.client_name }}</td>
                        <td>{{ lf.requested_date }}</td>
                        <td>{{ lf.address }}</td>
                        <td>{{ lf.plague_name }}</td>
                        <td>
                          <template v-if="editingId === lf.id">
                            <select v-model="editingStatus" class="form-select form-select-sm" style="width: 140px; display: inline-block;">
                              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                              </option>
                            </select>
                          </template>
                          <template v-else>
                            {{ statusTranslation[lf.status_name] || lf.status_name }}
                          </template>
                        </td>
                        <td>
                          <span v-if="editingId === lf.id">
                            <button class="btn btn-link p-0 me-2 text-success" @click="saveEdit(lf.id)" title="Guardar">
                              ✔️
                            </button>
                            <button class="btn btn-link p-0 text-secondary" @click="cancelEdit" title="Cancelar">
                              ✖️
                            </button>
                          </span>
                          <span v-else>
                            <button class="btn btn-link p-0 me-2" @click="startEdit(lf)" title="Editar status" v-html="EditIcon"></button>
                            <button class="btn btn-link p-0" @click="deleteFumigation(lf.id)" title="Eliminar" v-html="DeleteIcon"></button>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="listFumigations.length === 0" class="text-center my-2">
                    No hay solicitudes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <DefaultFooter />
</template>