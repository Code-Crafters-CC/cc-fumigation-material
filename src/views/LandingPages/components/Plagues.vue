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
const listPlagues = ref([]);
const fieldsPlagues = ref([
  "id",
  "plague_name",
  "insert_date",
  "plague_type"
]);
const plagueName = ref("");
const plagueType = ref("");
const fieldsPlagueType = ref(["id", "plague_type_name"]);
const listPlagueType = ref([]);
const editingId = ref(null);

const clear = () => {
  plagueName.value = "";
  plagueType.value = "";
  editingId.value = null;
};

const createOrUpdatePlague = async () => {
  try {
    if (editingId.value) {
      // PATCH
      await axios.patch(
        `plague/${editingId.value}/`,
        {
          plague_name: plagueName.value,
          plague_type: plagueType.value
        },
        {
          headers: {
            Authorization: `Bearer ${store.token.access}`,
          }
        }
      );
    } else {
      // POST
      await axios.post(
        "plague/",
        {
          plague_name: plagueName.value,
          plague_type: plagueType.value
        },
        {
          headers: {
            Authorization: `Bearer ${store.token.access}`,
          }
        }
      );
    }
    await listPlague();
    clear();
  } catch (error) {
    console.log(error);
  }
};

const listPlague = async () => {
  try {
    const response = await axios.get("plague/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listPlagues.value = response.data;
  } catch (error) {
    console.log(error);
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

const editPlague = (plague) => {
  editingId.value = plague.id;
  plagueName.value = plague.plague_name;
  // Si plague_type es un objeto, usa su id, si es un id ya, úsalo directo
  plagueType.value = plague.plague_type.id ?? plague.plague_type;
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
                          <div class="mb-4">
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
                                @click="clear">
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

              <!-- PLAGUES LIST -->
              <div class="col-md-8 col-xl-7 d-flex flex-column mx-auto mt-4 mt-md-0">
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
                            <th scope="col">Tipo de Plaga</th>
                            <th scope="col">Fecha de creación</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(lP, i) in listPlagues" :key="lP.id">
                            <td>{{ lP.id }}</td>
                            <td>{{ lP.plague_name }}</td>
                            <td>{{ lP.plague_type['plague_type_name'] }}</td>
                            <td>{{ lP.insert_date }}</td>
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