<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from '@/stores/index';
// Components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

const store = useAppStore();

const listFumigations = ref([]);
const fieldsFumigations = ref([
  "id",
  "client_name",
  "client_phone",
  "fumigation_date",
  "destination_place",
]);

const fieldsPlague = ref(["id", "plague_name", "insert_date", "plague_type"]);
const fieldsProducts = ref(["id", "product_name", "stock", "product_type"]);
const fieldsControlMethod = ref(["id", "control_method_name"]);
const fieldsStatus = ref(["id", "status_name"]);

const id = ref("");
const client_name = ref("");
const client_phone = ref("");
const client_dpi = ref("");
const fumigation_date = ref("");
const destination_place = ref("");
const total_products = ref("");
const plague = ref("");
const products = ref("");
const control_method = ref("");
const status = ref("");

const listPlague = ref([]);
const listProducts = ref([]);
const listControlMethod = ref([]);
const listStatus = ref([]);
const editingId = ref(null);

const clean = () => {
  client_name.value = "";
  client_phone.value = "";
  client_dpi.value = "";
  fumigation_date.value = "";
  destination_place.value = "";
  total_products.value = "";
  plague.value = "";
  products.value = "";
  control_method.value = "";
  status.value = "";
  editingId.value = null;
};

// PATCH y POST
const createOrUpdateFumigation = async () => {
  try {
    const payload = {
      client_name: client_name.value,
      client_phone: client_phone.value,
      client_dpi: client_dpi.value,
      fumigation_date: fumigation_date.value,
      destination_place: destination_place.value,
      total_products: total_products.value,
      plague: plague.value,
      products: products.value,
      control_method: control_method.value,
      status: status.value,
    };
    if (editingId.value) {
      await axios.patch(
        `controlForm/${editingId.value}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${store.token.access}`,
          }
        }
      );
    } else {
      await axios.post(
        "controlForm/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${store.token.access}`,
          }
        }
      );
    }
    await listarFumigaciones();
    clean();
  } catch (error) {
    console.log(error);
  }
};

const listarFumigaciones = async () => {
  try {
    const response = await axios.get("controlForm/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listFumigations.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

// Métodos para listar otros datos (todos con token)
const listarPlagues = async () => {
  try {
    const response = await axios.get("plague/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listPlague.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const listarProducts = async () => {
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

const listarControlMethods = async () => {
  try {
    const response = await axios.get("controlMethod/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listControlMethod.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const listarStatus = async () => {
  try {
    const response = await axios.get("status/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listStatus.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  return dateStr.replace('Z', '').slice(0, 16);
}


// Editar
const editFumigation = (fumigation) => {
  editingId.value = fumigation.id;
  client_name.value = fumigation.client_name;
  client_phone.value = fumigation.client_phone;
  client_dpi.value = fumigation.client_dpi;
  fumigation_date.value = formatDateForInput(fumigation.fumigation_date);
  destination_place.value = fumigation.destination_place;
  total_products.value = fumigation.total_products;
  // --- CORREGIDO: ASIGNA SOLO EL ID, NO EL OBJETO ---
  plague.value =
    typeof fumigation.plague === "object" && fumigation.plague !== null
      ? fumigation.plague.id
      : fumigation.plague;

  products.value = Array.isArray(fumigation.products)
    ? fumigation.products.map((p) =>
        typeof p === "object" && p !== null ? p.id : p
      )
    : typeof fumigation.products === "object" && fumigation.products !== null
    ? fumigation.products.id
    : fumigation.products;

  control_method.value =
    typeof fumigation.control_method === "object" && fumigation.control_method !== null
      ? fumigation.control_method.id
      : fumigation.control_method;

  status.value =
    typeof fumigation.status === "object" && fumigation.status !== null
      ? fumigation.status.id
      : fumigation.status;
};

// Eliminar
const deleteFumigation = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar esta fumigación?")) return;
  try {
    await axios.delete(`controlForm/${id}/`, {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    await listarFumigaciones();
    if (editingId.value === id) clean();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  setMaterialInput();
  listarFumigaciones();
  listarPlagues();
  listarProducts();
  listarControlMethods();
  listarStatus();
});
</script>

<template>
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
          <!-- FUMIGATIONS REGISTER -->
          <div class="container py-4">
            <div class="row justify-content-center">
              <div class="col-md-5 d-flex flex-column mx-auto">
                <div
                  class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                >
                  <div
                    class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
                  >
                    <div
                      class="bg-gradient-success shadow-success border-radius-lg p-3"
                    >
                      <h3
                        class="text-white font-weight-bolder text-center mt-2 mb-0"
                      >
                        Registro de Fumigaciones
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <form
                      role="form"
                      id="contact-form"
                      method="post"
                      autocomplete="off"
                      @submit.prevent="createOrUpdateFumigation"
                    >
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6">
                            <label class="form-label">Nombre del cliente</label>
                            <input
                              v-model="client_name"
                              class="form-control"
                              type="text"
                              placeholder="ej. Thomas"
                            />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label">Teléfono</label>
                            <input
                              v-model="client_phone"
                              class="form-control"
                              type="text"
                              placeholder="ej. 24280000"
                            />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label">DPI</label>
                            <input
                              v-model="client_dpi"
                              class="form-control"
                              type="text"
                              placeholder="3015 01852 1212"
                            />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label"
                              >Fecha de fumigación</label
                            >
                            <input
                              v-model="fumigation_date"
                              class="form-control"
                              type="datetime-local"
                              placeholder="ej. 2024-10-01T10:00"
                            />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label">Dirección</label>
                            <input
                              v-model="destination_place"
                              class="form-control"
                              type="text"
                              placeholder="ej. 8va calle, zona 1 San Marcos"
                            />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label"
                              >Cantidad de producto necesaria</label
                            >
                            <input
                              v-model="total_products"
                              class="form-control"
                              type="text"
                              placeholder="ej. 2"
                            />
                          </div>
                          <div class="mb-4">
                            <label for="rol" class="form-label"
                              >Selecciona una plaga a erradicar</label
                            >
                            <select
                              v-model="plague"
                              id="plague"
                              class="form-select"
                              :items="listPlague"
                              :fields="fieldsPlague"
                            >
                              <option
                                v-for="lp in listPlague"
                                v-bind:key="lp.id"
                                v-bind:value="lp.id"
                              >
                                {{ lp.plague_name }}
                              </option>
                            </select>
                            <label for="rol" class="form-label"
                              >Selecciona un producto</label
                            >
                            <select
                              v-model="products"
                              id="products"
                              class="form-select"
                              :items="listProducts"
                              :fields="fieldsProducts"
                            >
                              <option
                                v-for="lprod in listProducts"
                                v-bind:key="lprod.id"
                                v-bind:value="lprod.id"
                              >
                                {{ lprod.product_name }}
                              </option>
                            </select>
                            <label for="rol" class="form-label"
                              >Selecciona un método de control de plaga</label
                            >
                            <select
                              v-model="control_method"
                              id="controlMethod"
                              class="form-select"
                              :items="listControlMethod"
                              :fields="fieldsControlMethod"
                            >
                              <option
                                v-for="lcm in listControlMethod"
                                v-bind:key="lcm.id"
                                v-bind:value="lcm.id"
                              >
                                {{ lcm.control_method_name }}
                              </option>
                            </select>
                            <label for="rol" class="form-label"
                              >Selecciona el status de la fumigación</label
                            >
                            <select
                              v-model="status"
                              id="status"
                              class="form-select"
                              :items="listStatus"
                              :fields="fieldsStatus"
                            >
                              <option
                                v-for="ls in listStatus"
                                v-bind:key="ls.id"
                                v-bind:value="ls.id"
                              >
                                {{ ls.status_name }}
                              </option>
                            </select>
                            <div class="text-center">
                              <MaterialButton
                                class="my-4 mb-2"
                                variant="gradient"
                                color="success"
                                fullWidth
                                type="submit"
                              >
                                {{ editingId ? "Actualizar" : "Registrar" }}
                              </MaterialButton>
                              <MaterialButton v-if="editingId" class="my-4 mb-2" variant="outlined" color="dark" fullWidth
                                @click="clean">
                                Cancelar edición
                              </MaterialButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- FUMIGATIONS LIST -->
              <div class="col-md-7 d-flex flex-column mx-auto mt-4 mt-md-0">
                <div
                  class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                  style="
                    margin-top: 60px;
                    margin-left: 30px;
                    padding: 50px 20px 15px 5px;
                  "
                >
                  <div
                    class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
                  >
                    <div
                      class="bg-gradient-success shadow-success border-radius-lg p-3"
                    >
                      <h3 class="text-white text-success mb-0">Fumigaciones</h3>
                    </div>
                  </div>
                  <!-- Listado de fumigaciones-->
                  <div class="card-body">
                    <div
                      class="table-responsive"
                      style="
                        max-height: 200px;
                        overflow-y: auto;
                        margin-top: 10px;
                        margin-left: 15px;
                      "
                    >
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre del cliente</th>
                            <th scope="col">Teléfono</th>
                            <th scope="col">Fecha de fumigación</th>
                            <th scope="col">Dirección</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(lf, i) in listFumigations" :key="lf.id">
                            <td>{{ lf.id }}</td>
                            <td>{{ lf.client_name }}</td>
                            <td>{{ lf.client_phone }}</td>
                            <td>{{ lf.fumigation_date }}</td>
                            <td>{{ lf.destination_place }}</td>
                            <td>
                              <button class="btn btn-link p-0 me-2" @click="editFumigation(lf)" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.232 5.232l3.536 3.536M9 13.5V17h3.5l7.036-7.036a2.002 2.002 0 0 0 0-2.828l-3.672-3.672a2.002 2.002 0 0 0-2.828 0L9 7.5z" />
                                </svg>
                              </button>
                              <button class="btn btn-link p-0" @click="deleteFumigation(lf.id)" title="Eliminar">
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