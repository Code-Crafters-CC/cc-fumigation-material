<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from '@/stores/index';
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

const store = useAppStore();

const listFumigations = ref([]);
const fieldsFumigations = ref([
  "id",
  "client_name",
  "requested_date",
  "address",
  "plague_name",
  "status_name",
]);

const listarFumigaciones = async () => {
  try {
    const response = await axios.get("fumigationRequest/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listFumigations.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  listarFumigaciones();
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
        <div class="row justify-content-center">
          <div class="col-md-10 d-flex flex-column mx-auto mt-4 mt-md-0">
            <div
              class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
              style="margin-top: 60px; margin-left: 30px; padding: 50px 20px 15px 5px;"
            >
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
                        <!-- Agrega más columnas si lo necesitas -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(lf, i) in listFumigations" :key="lf.id">
                        <td>{{ lf.id }}</td>
                        <td>{{ lf.client_name }}</td>
                        <td>{{ lf.requested_date }}</td>
                        <td>{{ lf.address }}</td>
                        <td>{{ lf.plague_name }}</td>
                        <td>{{ lf.status_name }}</td>
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
  </section>
  <DefaultFooter />
</template>