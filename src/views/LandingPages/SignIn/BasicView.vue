<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "../../../router/index";
import {useAppStore} from '../../../stores/index'
// example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";

//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
import { jwtDecode } from "jwt-decode";

// Definir las propiedades reactivas utilizando ref()
const fields = ref([
  "id",
  "first_name",
  "last_name",
  "user_name",
  "email",
  "password",
  "rol",
]);

const fieldsRol = ref(["id", "rol_name", "insert_date"]);
const first_name = ref("");
const last_name = ref("");
const username = ref("");
const email = ref("");
const password = ref("");
const rol = ref("");
const showLogin = ref(true);
const showRegister = ref(false);
const listRol = ref([]);
const emailLogin = ref("");
const passwordLogin = ref("");

// Método para crear un usuario
const createUser = async () => {
  try {
    const response = await axios.post("users/", {
      first_name: first_name.value,
      last_name: last_name.value,
      username: username.value,
      email: email.value,
      password: password.value,
      rol: rol.value
    }); 
    console.log(response);

    toggleForms();
  } catch (error) {
    console.log(error);
  }
};

//Método de login
const login = async () => {
  try {
    const response = await axios.post('/api/token/', {
      email: emailLogin.value,
      password: passwordLogin.value
    });

    const appStore = useAppStore();
    appStore.guardarToken(response.data);

    const access = response.data.access;
    const decoded = jwtDecode(access);
    console.log('Rol:', decoded.rol);

    appStore.guardarRol(decoded.rol);
    router.push({ name: 'about' });

  } catch (error) {
    console.log(error);
  }
}

// Método para listar roles
const listarRol = async () => {
  try {
    const response = await axios.get("roles/");
    listRol.value = response.data;
    console.log(listRol.value);
  } catch (error) {
    console.log(error);
  }
};

// Función para alternar entre los formularios
const toggleForms = () => {
  showLogin.value = !showLogin.value;
  showRegister.value = !showRegister.value;
};

// Ejecutar listarRol cuando se monta el componente
onMounted(() => {
  setMaterialInput();
  listarRol();
});
</script>


<template>
  <DefaultNavbar transparent />
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)',
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>

      <!-- Form Login -->
      <div class="container my-auto" div v-if="showLogin">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1"
                >
                  <h4
                    class="text-white font-weight-bolder text-center mt-2 mb-0"
                  >
                    Sign in
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start" @submit.prevent = "onsubmit">
                  <label class="form-label">Correo electrónico</label>
                  <input
                    id="email"
                    class="my-3 form-control"
                    label="Correo electrónico"
                    type="email"
                    v-model="emailLogin"
                  />
                  <label class="form-label">Contraseña</label>
                  <input
                    id="password"
                    class="mb-3 form-control"
                    label="Contraseña"
                    type="password"
                    v-model="passwordLogin"
                  />
                  <div class="text-center">
                    <MaterialButton
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      fullWidth
                      @click="login"
                      >Ingresa</MaterialButton
                    >
                  </div>
                  <p class="mt-4 text-sm text-center">
                    ¿No tienes una cuenta?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      @click="toggleForms"
                      >Registrate</a
                    >
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Sign up -->
      <div class="container py-4" v-if="showRegister">
        <div class="row justify-content-center">
          <div
            class="mt-8 col-xl-5 col-lg-6 col-md-7 d-flex flex-column mx-auto"
          >
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
                    Registro de usuario
                  </h3>
                </div>
              </div>
              <div class="card-body">
                <form
                  role="form"
                  id="contact-form"
                  method="post"
                  autocomplete="off"
                  @submit.prevent = "onsubmit"
                >
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <label class="form-label">Nombre</label>
                        <input
                          v-model="first_name"
                          class="form-control"
                          label="First Name"
                          type="text"
                          placeholder="ej. Thomas"
                        />
                      </div>
                      <div class="col-md-6 ps-2">
                        <label class="form-label">Apellido</label>
                        <input
                          v-model="last_name"
                          class="form-control"
                          label="Last Name"
                          type="text"
                          placeholder="ej. Fuentes"
                        />
                      </div>
                      <div class="col-md-6 ps-2">
                        <label class="form-label">Username</label>
                        <input
                          v-model="username"
                          class="form-control"
                          label="Username"
                          type="text"
                          placeholder="Cualquier username"
                        />
                      </div>
                      <div class="col-md-6 ps-2">
                        <label class="form-label">Correo</label>
                        <input
                          v-model="email"
                          class="form-control"
                          label="Email Address"
                          type="text"
                          placeholder="ej. email@gmail.com"
                        />
                      </div>
                      <div class="col-md-6 ps-2">
                        <label class="form-label">Contraseña</label>
                        <input
                          v-model="password"
                          class="form-control"
                          label="Password"
                          type="password"
                        />
                      </div>
                      <div class="mb-4">
                        <label for="rol" class="form-label"
                          >Selecciona un rol de usuario</label
                        >
                        <select
                          v-model="rol"
                          id="rol"
                          class="form-select"
                          :items="listRol"
                          :fields="fieldsRol"
                        >
                          <option
                            v-for="lr in listRol"
                            v-bind:key="lr.id"
                            v-bind:value="lr.id"
                          >
                            {{ lr.rol_name }}
                          </option>
                        </select>
                        <div class="text-center">
                          <MaterialButton
                            class="my-4 mb-2"
                            variant="gradient"
                            color="success"
                            fullWidth
                            @click= "createUser"
                            >Registrar</MaterialButton
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Header>
</template>
