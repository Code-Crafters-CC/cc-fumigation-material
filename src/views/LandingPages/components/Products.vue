<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//image
import image from "@/assets/img/illustrations/illustration-signin.jpg";

//material components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextArea from "@/components/MaterialTextArea.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";

const listProducts = ref([]);
const fields = ref(["id", "product_name", "stock", "product_type"]);

const fieldsProduct = ref[("id", "product_type_name")];
const product_name = ref("");
const stock = ref("");
const listProductType = ref([]);
const product_type = ref("");

const clean = async() =>{
  product_name.value = "";
  stock.value = "";
  product_type.value = ""
}

// Método para crear un producto
const createProducts = async () => {
  try {
    const response = await axios.post("product/", {
      product_name: product_name.value,
      stock: stock.value,
      product_type: product_type.value,
    });
    console.log(response);
    await listarProductos();
    clean();
  } catch (error) {
    console.log(error);
  }
};

const listarProductos = async () => {
  try {
    await axios.get("product/").then((response) => {
      listProducts.value = response.data;
      console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
};

// Método para listar los tipos de productos
const listarTiposProductos = async () => {
  try {
    const response = await axios.get("productType/list/");
    listProductType.value = response.data;
    console.log(listProductType.value);
  } catch (error) {
    console.log(error);
  }
};


onMounted(() => {
  setMaterialInput();
  listarProductos();
  listarTiposProductos();
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
                        Registro de Productos
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <form
                      role="form"
                      id="contact-form"
                      method="post"
                      autocomplete="off"
                      @submit.prevent="onsubmit"
                    >
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6">
                            <label class="form-label">Nombre del producto</label>
                            <input
                              v-model="product_name"
                              class="form-control"
                              type="text"
                              placeholder="ej. Landris"
                            />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label">Stock</label>
                            <input
                              v-model="stock"
                              class="form-control"
                              type="text"
                              placeholder="ej. 10"
                            />
                          </div>
                          <div class="mb-4">
                            <label for="rol" class="form-label"
                              >Selecciona el tipo de producto a utilizar</label
                            >
                            <select
                              v-model="product_type"
                              id="productType"
                              class="form-select"
                              :items="listProductType"
                              :fields="fieldsProduct"
                            >
                              <option
                                v-for="lp in listProductType"
                                v-bind:key="lp.id"
                                v-bind:value="lp.id"
                              >
                                {{ lp.product_type_name }}
                              </option>
                            </select>
                            <div class="text-center">
                              <MaterialButton
                                class="my-4 mb-2"
                                variant="gradient"
                                color="success"
                                fullWidth
                                @click="createProducts"
                              >
                                Registrar
                              </MaterialButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <!-- Tabla de productos -->
              <div
                class="mt-3 col-xl-7 col-lg-8 col-md-9 d-flex flex-column ms-auto me-auto ms-lg-auto me-sm-0"
              >
                <div
                  class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                >
                  <div
                    class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent"
                  >
                    <div
                      class="bg-gradient-success shadow-success border-radius-lg p-3"
                    >
                      <h3 class="text-white text-success mb-0">
                        Productos disponibles
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <div
                      class="table-responsive"
                      style="max-height: 200px; overflow-y: auto;"
                    >
                      <table
                        class="table table-striped"
                        :items="listProducts"
                        :fields="fields"
                      >
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Producto</th>
                            <th scope="col">Tipo de Producto</th>
                            <th scope="col">En Stock</th>
                            <th scope="col">Alerta</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(lp, i) in listProducts"
                            v-bind:key="lp.id"
                          >
                            <td>{{ lp.id }}</td>
                            <td>{{ lp.product_name }}</td>
                            <td>{{ lp.product_type["product_type_name"] }}</td>
                            <td>{{ lp.stock }}</td>
                            <td>
                              <div
                                class="alert-warning"
                                role="alert"
                                v-if="lp.stock < 4 && lp.stock > 0"
                              >
                                <div style="color: white; text-align: center">
                                  Estás por quedarte sin producto!
                                </div>
                              </div>
                              <div
                                class="alert-danger"
                                role="alert"
                                v-if="lp.stock == 0"
                              >
                                <div style="color: white; text-align: center">
                                  Fuera de stock
                                </div>
                              </div>
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
