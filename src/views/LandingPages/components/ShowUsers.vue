<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from "@/stores/index";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

const store = useAppStore();

const listUsers = ref([]);
const listRoles = ref([]);
const fields = ref([
  "id",
  "first_name",
  "last_name",
  "username",
  "email",
  "insert_date",
  "rol",
  "is_active"
]);

const id = ref("");
const first_name = ref("");
const last_name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const rol = ref("");
const editingId = ref(null);

const clean = () => {
  first_name.value = "";
  last_name.value = "";
  username.value = "";
  email.value = "";
  password.value = "";
  rol.value = "";
  editingId.value = null;
};

const listarUsuarios = async () => {
  try {
    const response = await axios.get("users/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listUsers.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const listarRoles = async () => {
  try {
    const response = await axios.get("roles/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listRoles.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const createOrUpdateUser = async () => {
  try {
    let payload = {
      first_name: first_name.value,
      last_name: last_name.value,
      username: username.value,
      email: email.value,
      rol: rol.value,
    };
    if (password.value) {
      payload.password = password.value;
    }
    if (editingId.value) {
      // PATCH
      await axios.patch(`users/${editingId.value}/`, payload, {
        headers: {
          Authorization: `Bearer ${store.token.access}`,
        }
      });
    } else {
      // INSERT
      await axios.post("users/", payload, {
        headers: {
          Authorization: `Bearer ${store.token.access}`,
        }
      });
    }
    await listarUsuarios();
    clean();
  } catch (error) {
    console.log(error);
    if (error.response) {
      alert(JSON.stringify(error.response.data, null, 2));
    }
  }
};

const editUser = (user) => {
  editingId.value = user.id;
  first_name.value = user.first_name;
  last_name.value = user.last_name;
  username.value = user.username;
  email.value = user.email;
  password.value = "";
  // Si rol es objeto, saca el id
  rol.value =
    typeof user.rol === "object" && user.rol !== null
      ? user.rol.id
      : user.rol;
};

// Soft delete (desactivar usuario)
const deactivateUser = async (id) => {
  if (!confirm("¿Seguro que deseas desactivar este usuario?")) return;
  try {
    await axios.patch(`users/${id}/`, { is_active: false }, {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    await listarUsuarios();
    if (editingId.value === id) clean();
  } catch (error) {
    console.log(error);
  }
};

// Reactivar usuario
const activateUser = async (id) => {
  if (!confirm("¿Seguro que deseas reactivar este usuario?")) return;
  try {
    await axios.patch(`users/${id}/`, { is_active: true }, {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    await listarUsuarios();
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  setMaterialInput();
  listarUsuarios();
  listarRoles();
});
</script>

<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <DefaultNavbar :sticky="true" :action="{
          route: 'https://www.creative-tim.com/product/vue-material-kit-pro',
          color: 'bg-gradient-success',
        }" />
      </div>
    </div>
  </div>
  <section>
    <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
          <div class="col-1 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
            <div class="position-relative h-100 m-9 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }" loading="lazy"></div>
          </div>
          <!-- USER REGISTER FORM -->
          <div class="container py-4">
            <div class="row justify-content-center">
              <div class="col-md-4 d-flex flex-column mx-auto">
                <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                      <h3 class="text-white font-weight-bolder text-center mt-2 mb-0">
                        {{ editingId ? "Editar Usuario" : "Registrar Usuario" }}
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <form role="form" id="user-form" method="post" autocomplete="off" @submit.prevent="createOrUpdateUser">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6">
                            <label class="form-label">Nombre</label>
                            <input v-model="first_name" class="form-control" type="text" placeholder="Nombre" required />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Apellido</label>
                            <input v-model="last_name" class="form-control" type="text" placeholder="Apellido" required />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Username</label>
                            <input v-model="username" class="form-control" type="text" placeholder="Nombre de usuario" required />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Correo</label>
                            <input v-model="email" class="form-control" type="email" placeholder="Correo" required />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Contraseña</label>
                            <input v-model="password" class="form-control" type="password" placeholder="Contraseña" :required="!editingId" />
                          </div>
                          <div class="col-md-6">
                            <label class="form-label">Rol</label>
                            <select v-model="rol" class="form-select" required>
                              <option value="" disabled>Selecciona un rol</option>
                              <option v-for="r in listRoles" :key="r.id" :value="r.id">
                                {{ r.rol_name || r.name || r.id }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="text-center">
                          <MaterialButton class="my-4 mb-2" variant="gradient" color="success" fullWidth type="submit">
                            {{ editingId ? "Actualizar" : "Registrar" }}
                          </MaterialButton>
                          <MaterialButton v-if="editingId" class="my-4 mb-2" variant="outlined" color="dark" fullWidth @click="clean">
                            Cancelar edición
                          </MaterialButton>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <!-- USERS LIST -->
              <div class="col-xl-8 col-lg-9 col-md-10 d-flex flex-column mx-auto mt-4 mt-md-0">
                <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                  style="margin-top: 60px; margin-left: 30px; padding: 50px 20px 15px 5px;">
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                    <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                      <h3 class="text-white text-success mb-0">Usuarios</h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive" style="max-height: 500px; overflow-y:auto;">
                      <table class="table table-striped" :items="listUsers" :fields="fields">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nombre Completo</th>
                            <th scope="col">Username</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Fecha de ingreso</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="lU in listUsers" :key="lU.id">
                            <td>{{ lU.id }}</td>
                            <td>{{ lU.first_name }} {{ lU.last_name }}</td>
                            <td>{{ lU.username }}</td>
                            <td>{{ lU.email }}</td>
                            <td>{{ lU.insert_date }}</td>
                            <td>{{ lU.rol?.rol_name || lU.rol?.name || lU.rol }}</td>
                            <td>
                              <span :class="lU.is_active ? 'text-success' : 'text-danger'">
                                {{ lU.is_active ? "Activo" : "Inactivo" }}
                              </span>
                            </td>
                            <td>
                              <button class="btn btn-link p-0 me-2" @click="editUser(lU)" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.232 5.232l3.536 3.536M9 13.5V17h3.5l7.036-7.036a2.002 2.002 0 0 0 0-2.828l-3.672-3.672a2.002 2.002 0 0 0-2.828 0L9 7.5z" />
                                </svg>
                              </button>
                              <button
                                v-if="lU.is_active"
                                class="btn btn-link p-0 text-danger"
                                @click="deactivateUser(lU.id)"
                                title="Desactivar usuario"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5-4h4a2 2 0 0 1 2 2v2H7V5a2 2 0 0 1 2-2zm-4 4h12"/>
                                </svg>
                              </button>
                              <button
                                v-else
                                class="btn btn-link p-0 text-success"
                                @click="activateUser(lU.id)"
                                title="Reactivar usuario"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M5 13l4 4L19 7" />
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