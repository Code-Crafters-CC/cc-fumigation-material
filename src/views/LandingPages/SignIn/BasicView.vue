<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import router from "../../../router/index";
import {useAppStore} from '../../../stores/index'
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import { jwtDecode } from "jwt-decode";
import StockNotificationService from "@/data/StockNotificationService.js";

const first_name = ref("");
const last_name = ref("");
const username = ref("");
const email = ref("");
const showLogin = ref(true);
const showRegister = ref(false);
const emailLogin = ref("");
const passwordLogin = ref("");
const password = ref("");
const rol = ref(2); // Rol por defecto: Administrador


const sendUserRequest = async () => {
  try {
    const response = await axios.post("/api/request/user/", {
      nombre: first_name.value,
      apellido: last_name.value,
      username: username.value,
      correo: email.value,
    });
    alert("¡Solicitud enviada! El administrador revisará tu petición.");
    toggleForms();
    // Limpiar campos
    first_name.value = "";
    last_name.value = "";
    username.value = "";
    email.value = "";
  } catch (error) {
    alert("Error al enviar la solicitud. Intenta de nuevo.");
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
    console.log("Token:", response.data);

    const access = response.data.access;
    const decoded = jwtDecode(access);
    console.log('Rol:', decoded.rol);

    appStore.guardarRol(decoded.rol);
    
    // Verificar niveles de stock para administradores después del login
    if (decoded.rol === 2 || decoded.rol === "2" || decoded.rol === "Administrador") {
      // Esperar un poco para que el componente de notificaciones esté listo
      setTimeout(() => {
        StockNotificationService.checkAndNotifyStockLevels(decoded.rol);
      }, 1000);
    }
    
    router.push({ name: 'about' });

  } catch (error) {
    console.log(error);
    // Mostrar notificación de error en el login
    StockNotificationService.addCustomNotification(
      "Error de Login",
      "Credenciales incorrectas. Verifica tu email y contraseña.",
      "danger",
      "fas fa-exclamation-circle"
    );
  }
}

const toggleForms = () => {
  showLogin.value = !showLogin.value;
  showRegister.value = !showRegister.value;
};

onMounted(() => {
  setMaterialInput();
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
      <div class="container my-auto" v-if="showLogin">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                  <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                    Login
                  </h4>
                </div>
              </div>
              <div class="card-body">
                <form role="form" class="text-start" @submit.prevent = "login">
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
                      type="submit"
                    >Ingresa</MaterialButton>
                  </div>
                  <p class="mt-4 text-sm text-center">
                    ¿No tienes una cuenta?
                    <a
                      href="#"
                      class="text-success text-gradient font-weight-bold"
                      @click="toggleForms"
                      >Enviar solicitud de creación de usuario</a
                    >
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Solicitud de usuario -->
      <div class="container py-4" v-if="showRegister">
        <div class="row justify-content-center">
          <div class="mt-8 col-xl-5 col-lg-6 col-md-7 d-flex flex-column mx-auto">
            <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                  <h3 class="text-white font-weight-bolder text-center mt-2 mb-0">
                    Enviar solicitud de creación de usuario
                  </h3>
                </div>
              </div>
              <div class="card-body">
                <form
                  role="form"
                  id="request-form"
                  method="post"
                  autocomplete="off"
                  @submit.prevent="sendUserRequest"
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
                          required
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
                          required
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
                          required
                        />
                      </div>
                      <div class="col-md-6 ps-2">
                        <label class="form-label">Correo</label>
                        <input
                          v-model="email"
                          class="form-control"
                          label="Email Address"
                          type="email"
                          placeholder="ej. email@gmail.com"
                          required
                        />
                      </div>
                      <div class="text-center">
                        <MaterialButton
                          class="my-4 mb-2"
                          variant="gradient"
                          color="success"
                          fullWidth
                          type="submit"
                        >
                          Enviar solicitud de creación de usuario
                        </MaterialButton>
                      </div>
                    </div>
                  </div>
                </form>
                <p class="mt-4 text-sm text-center">
                  ¿Ya tienes una cuenta?
                  <a
                    href="#"
                    class="text-success text-gradient font-weight-bold"
                    @click="toggleForms"
                  >Ingresa aquí</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Header>
</template>
