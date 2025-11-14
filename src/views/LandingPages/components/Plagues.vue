<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { useAppStore } from '@/stores/index';
// Components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

const store = useAppStore();
const listPlagues = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const fieldsPlagues = ref([
  "id",
  "plague_name",
  "description",
  "insert_date",
  "plague_type",
  "recommended_products"
]);
const plagueName = ref("");
const plagueType = ref("");
const description = ref("");
const recommendedProducts = ref([]);
const listProducts = ref([]);

const fieldsPlagueType = ref(["id", "plague_type_name"]);
const listPlagueType = ref([]);
const editingId = ref(null);

const clear = () => {
  plagueName.value = "";
  plagueType.value = "";
  description.value = "";
  recommendedProducts.value = [];
  editingId.value = null;
};

const createOrUpdatePlague = async () => {
  try {
    // Validar datos de entrada
    if (!plagueName.value.trim()) {
      alert("Por favor ingresa el nombre de la plaga");
      return;
    }
    if (!plagueType.value) {
      alert("Por favor selecciona un tipo de plaga");
      return;
    }
    
    isSubmitting.value = true;
    
    // Verificar token
    const token = store.token?.access || store.token;
    console.log("Token a usar:", token ? "Token disponible" : "Token no encontrado");
    
    if (!token) {
      alert("No hay token de autenticación disponible");
      return;
    }

    const payload = {
      plague_name: plagueName.value,
      plague_type: plagueType.value,
      description: description.value,
      recommended_products: recommendedProducts.value
    };

    console.log("Payload a enviar:", payload);

    let response;
    if (editingId.value) {
      response = await axios.patch(`plague/${editingId.value}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Plaga actualizada:", response.data);
      alert("Plaga actualizada correctamente");
    } else {
      response = await axios.post("plague/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Nueva plaga creada:", response.data);
      alert("Plaga creada correctamente");
    }

    // Limpiar formulario
    plagueName.value = "";
    plagueType.value = "";
    description.value = "";
    recommendedProducts.value = [];
    editingId.value = null;

    // Actualizar la lista inmediatamente
    console.log("Actualizando lista de plagas...");
    
    // Pequeño delay para asegurar que el servidor haya procesado completamente
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Forzar actualización de la lista
    await listPlague();
    
    // Verificar si la lista se actualizó
    console.log("Lista actualizada. Total de plagas:", listPlagues.value.length);
    
  } catch (error) {
    console.error("Error completo:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      alert(`Error del servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Error de conexión: No se pudo conectar con el servidor");
    } else {
      console.error("Error setting up request:", error.message);
      alert(`Error: ${error.message}`);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const listPlague = async () => {
  try {
    isLoading.value = true;
    
    // Obtener el token correctamente
    const token = store.token?.access || store.token;
    if (!token) {
      console.error("No hay token de autenticación disponible para listar plagas");
      return;
    }

    console.log("Cargando lista de plagas...");
    const response = await axios.get("plague/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Forzar reactividad limpiando primero
    listPlagues.value = [];
    await nextTick();
    listPlagues.value = response.data;
    
    console.log("Lista de plagas actualizada:", response.data.length, "elementos");
    
  } catch (error) {
    console.error("Error al cargar plagas:", error);
    if (error.response) {
      console.error("Respuesta del servidor:", error.response.data);
    }
  } finally {
    isLoading.value = false;
  }
};

const listarPlagueType = async () => {
  try {
    const response = await axios.get("plagueType/list/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listPlagueType.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const listarProductos = async () => {
  try {
    const response = await axios.get("product/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listProducts.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const editPlague = (plague) => {
  editingId.value = plague.id;
  plagueName.value = plague.plague_name;
  plagueType.value = plague.plague_type.id ?? plague.plague_type;
  description.value = plague.description || "";
  recommendedProducts.value = Array.isArray(plague.recommended_products)
    ? plague.recommended_products.map(p => typeof p === "object" ? p.id : p)
    : [];
};

const deletePlague = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar esta plaga?")) return;
  try {
    await axios.delete(`plague/${id}/`, {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    await listPlague();
    if (editingId.value === id) clear();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  setMaterialInput();
  listPlague();
  listarPlagueType();
  listarProductos();
});
</script>

<template>
  <!-- FontAwesome debe estar en tu index.html -->
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
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div
            class="col-1 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column"
          >
            <div
              class="position-relative h-100 m-9 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }"
              loading="lazy"
            ></div>
          </div>
          <!-- PLAGUE REGISTER -->
          <div class="container py-4">
            <div class="row justify-content-center">
              <div class="col-md-5 d-flex flex-column mx-auto">
                <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                      <h3 class="text-white font-weight-bolder text-center mt-2 mb-0">
                        Registro de Plagas
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <form
                      role="form"
                      id="contact-form"
                      method="post"
                      autocomplete="off"
                      @submit.prevent="createOrUpdatePlague"
                    >
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6">
                            <label class="form-label">Nombre de la Plaga</label>
                            <input
                              v-model="plagueName"
                              class="form-control"
                              type="text"
                              placeholder="ej. Cucarachas"
                            />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Descripción</label>
                            <textarea
                              v-model="description"
                              class="form-control"
                              type="text"
                              placeholder="Describe la plaga"
                              rows="2"
                            />
                          </div>
                          <div class="col-md-12 mt-2">
                            <label for="rol" class="form-label">Selecciona el tipo de plaga</label>
                            <select
                              v-model="plagueType"
                              id="plague"
                              class="form-select"
                              :items="listPlagueType"
                              :fields="fieldsPlagueType"
                            >
                              <option
                                v-for="lpt in listPlagueType"
                                v-bind:key="lpt.id"
                                v-bind:value="lpt.id"
                              >
                                {{ lpt.plague_type_name}}
                              </option>
                            </select>
                          </div>
                          <div class="col-md-12 mt-2">
                            <label for="recommended_products" class="form-label">Productos recomendados</label>
                            <select
                              v-model="recommendedProducts"
                              multiple
                              id="recommended_products"
                              class="form-select"
                            >
                              <option
                                v-for="prod in listProducts"
                                :key="prod.id"
                                :value="prod.id"
                              >
                                {{ prod.product_name }}
                              </option>
                            </select>
                          </div>
                          <div class="text-center col-md-12 mt-3">
                            <MaterialButton
                              class="my-4 mb-2"
                              variant="gradient"
                              color="success"
                              fullWidth
                              type="submit"
                              :disabled="isSubmitting"
                            >
                              <span v-if="isSubmitting">
                                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                Procesando...
                              </span>
                              <span v-else>
                                {{ editingId ? "Actualizar" : "Registrar" }}
                              </span>
                            </MaterialButton>
                            <MaterialButton v-if="editingId" class="my-4 mb-2" variant="outlined" color="dark" fullWidth
                              @click="clear">
                              Cancelar edición
                            </MaterialButton>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- PLAGUES LIST -->
              <div class="mt-3 col-xl-7 col-lg-8 col-md-9 d-flex flex-column ms-auto me-auto ms-lg-auto me-sm-0">
                <div
                  class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                  style="margin-top: 60px; margin-left: 30px; padding: 50px 20px 15px 5px;"
                >
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                    <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                      <h3 class="text-white text-success mb-0">Plagas</h3>
                    </div>
                  </div>
                  <!-- Listado de plagas-->
                  <div class="card-body">
                    <div class="table-responsive" style="max-height: 200px; overflow-y: auto;">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Plaga</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Tipo de Plaga</th>
                            <th scope="col">Fecha de creación</th>
                            <th scope="col">Productos recomendados</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="isLoading">
                            <td colspan="6" class="text-center">
                              <div class="spinner-border text-success" role="status">
                                <span class="visually-hidden">Cargando...</span>
                              </div>
                            </td>
                          </tr>
                          <tr v-for="lP in listPlagues" :key="lP.id" v-else>
                            <td>{{ lP.id }}</td>
                            <td>{{ lP.plague_name }}</td>
                            <td>{{ lP.description }}</td>
                            <td>{{ lP.plague_type?.plague_type_name || '' }}</td>
                            <td>{{ lP.insert_date }}</td>
                            <td>
                              <ul style="margin: 0; padding-left: 15px;">
                                <li v-for="prod in lP.recommended_products" :key="prod.id">
                                  {{ prod.product_name }}
                                </li>
                              </ul>
                            </td>
                            <td>
                              <button class="btn btn-link p-0 me-2" @click="editPlague(lP)" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.232 5.232l3.536 3.536M9 13.5V17h3.5l7.036-7.036a2.002 2.002 0 0 0 0-2.828l-3.672-3.672a2.002 2.002 0 0 0-2.828 0L9 7.5z" />
                                </svg>
                              </button>
                              <button class="btn btn-link p-0" @click="deletePlague(lP.id)" title="Eliminar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5-4h4a2 2 0 0 1 2 2v2H7V5a2 2 0 0 1 2-2zm-4 4h12"/>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
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