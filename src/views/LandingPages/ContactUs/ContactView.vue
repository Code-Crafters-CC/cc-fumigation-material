<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from '@/stores/index'; // <-- Usa el store para el token
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

const store = useAppStore();
const listHistory = ref([]);

const listarHistorial = async () => {
  try {
    const response = await axios.get('history/', {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      }
    });
    listHistory.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  setMaterialInput();
  listarHistorial();
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
        <div class="row justify-content-center">
          <div class="mt-3 col-xl-10 col-lg-10 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-sm-0">
            <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                  <h3 class="text-white text-success mb-0">Historial de consumo</h3>
                </div>
              </div>
              <!--contenido de historial de consumo-->
              <div class="card-body">
                <div class="table-responsive" style="max-height: 500px; overflow-y:auto;">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Producto utilizado</th>
                        <th scope="col">Tipo de producto</th>
                        <th scope="col">Producto utilizado</th>
                        <th scope="col">Producto restante</th>
                        <th scope="col">Fecha de uso</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(lh, i) in listHistory" :key="lh.id">
                        <td>{{ lh.id }}</td>
                        <td>{{ lh.product?.product_name || '-' }}</td>
                        <td>{{ lh.product?.product_type?.product_type_name || '-' }}</td>
                        <td>{{ lh.used_stock ?? '-' }}</td>
                        <td>{{ lh.product?.stock ?? '-' }}</td>
                        <td>{{ lh.insert_date }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="!listHistory.length" class="text-center my-2">
                    No hay historial registrado.
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