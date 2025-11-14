<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import { useAppStore } from '@/stores/index';

import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

const listProducts = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const fields = ref([
  "id", "product_name", "stock", "price", "product_type", "provider"
]);
const fieldsProduct = ref(["id", "product_type_name"]);

const product_name = ref("");
const stock = ref("");
const price = ref("");
const product_type = ref("");
const provider = ref(""); // Nuevo campo
const listProductType = ref([]);
const store = useAppStore();

const editingId = ref(null);

const clean = async () => {
  product_name.value = "";
  stock.value = "";
  price.value = "";
  product_type.value = "";
  provider.value = "";
  editingId.value = null;
};

const createOrUpdateProduct = async () => {
  try {
    // Validar datos de entrada
    if (!product_name.value.trim()) {
      alert("Por favor ingresa el nombre del producto");
      return;
    }
    if (!stock.value || stock.value < 0) {
      alert("Por favor ingresa un stock válido");
      return;
    }
    if (!price.value || price.value <= 0) {
      alert("Por favor ingresa un precio válido");
      return;
    }
    if (!product_type.value) {
      alert("Por favor selecciona un tipo de producto");
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
      product_name: product_name.value,
      stock: stock.value,
      price: price.value,
      product_type: product_type.value,
      provider: provider.value,
    };

    console.log("Payload a enviar:", payload);

    let response;
    if (editingId.value) {
      response = await axios.patch(`product/${editingId.value}/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Producto actualizado:", response.data);
      alert("Producto actualizado correctamente");
    } else {
      response = await axios.post("product/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Nuevo producto creado:", response.data);
      alert("Producto creado correctamente");
    }

    // Limpiar formulario
    clean();

    // Actualizar la lista inmediatamente
    console.log("Actualizando lista de productos...");
    
    // Pequeño delay para asegurar que el servidor haya procesado completamente
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Forzar actualización de la lista
    await listarProductos();
    
    // Verificar si la lista se actualizó
    console.log("Lista actualizada. Total de productos:", listProducts.value.length);
    
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

const listarProductos = async () => {
  try {
    isLoading.value = true;
    
    // Verificar token
    const token = store.token?.access || store.token;
    console.log("Token para listar productos:", token ? "Disponible" : "No disponible");
    
    if (!token) {
      console.error("No hay token de autenticación disponible para listar productos");
      return;
    }

    console.log("Cargando lista de productos...");
    
    const response = await axios.get("product/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Forzar reactividad limpiando primero
    listProducts.value = [];
    await nextTick();
    listProducts.value = response.data;
    
    console.log("Lista de productos actualizada:", response.data.length, "elementos");
    
  } catch (error) {
    console.error("Error al cargar productos:", error);
    if (error.response) {
      console.error("Respuesta del servidor:", error.response.data);
    }
  } finally {
    isLoading.value = false;
  }
};

const listarTiposProductos = async () => {
  try {
    const response = await axios.get("productType/list/", {
      headers: {
        Authorization: `Bearer ${store.token.access}`,
      },
    });
    listProductType.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const editProduct = (product) => {
  editingId.value = product.id;
  product_name.value = product.product_name;
  stock.value = product.stock;
  price.value = product.price;
  product_type.value = product.product_type.id ?? product.product_type;
  provider.value = product.provider ?? "";
};

const deleteProduct = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  
  try {
    console.log("Eliminando producto con ID:", id);
    
    // Verificar token
    const token = store.token?.access || store.token;
    if (!token) {
      alert("No hay token de autenticación disponible");
      return;
    }

    await axios.delete(`product/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Producto eliminado correctamente");
    alert("Producto eliminado correctamente");
    
    // Actualizar la lista inmediatamente
    console.log("Actualizando lista después de eliminación...");
    await listarProductos();
    
    // Limpiar formulario si estaba editando este producto
    if (editingId.value === id) {
      clean();
    }
    
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    console.error("Error response:", error.response);
    
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
          <div
            class="col-1 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
            <div class="position-relative h-100 m-9 px-7 border-radius-lg d-flex flex-column justify-content-center"
              :style="{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
              }" loading="lazy"></div>
          </div>
          <!-- PRODUCT REGISTER -->
          <div class="container py-4">
            <div class="row justify-content-center">
              <div class="col-md-5 d-flex flex-column mx-auto">
                <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                    <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                      <h3 class="text-white font-weight-bolder text-center mt-2 mb-0">
                        Registro de Productos
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <form role="form" id="contact-form" method="post" autocomplete="off" @submit.prevent="createOrUpdateProduct">
                      <div class="card-body">
                        <div class="row">
                          <div class="col-md-6">
                            <label class="form-label">Nombre del producto</label>
                            <input v-model="product_name" class="form-control" type="text" placeholder="ej. Landris" />
                          </div>
                          <div class="col-md-6 ps-2">
                            <label class="form-label">Stock</label>
                            <input v-model="stock" class="form-control" type="text" placeholder="ej. 10" />
                          </div>
                          <div class="col-md-12 mt-3">
                            <label class="form-label">Precio</label>
                            <input v-model="price" class="form-control" type="number" min="0" step="0.01"
                              placeholder="ej. 199.99" />
                          </div>
                          <div class="col-md-12 mt-3">
                            <label class="form-label">Proveedor</label>
                            <input v-model="provider" class="form-control" type="text" placeholder="ej. Agroquímicos XYZ" />
                          </div>
                          <div class="mb-4">
                            <label for="rol" class="form-label">Selecciona el tipo de producto</label>
                            <select v-model="product_type" id="productType" class="form-select" :items="listProductType"
                              :fields="fieldsProduct">
                              <option v-for="lp in listProductType" v-bind:key="lp.id" v-bind:value="lp.id">
                                {{ lp.product_type_name }}
                              </option>
                            </select>
                            <div class="text-center">
                              <MaterialButton 
                                class="my-4 mb-2" 
                                variant="gradient" 
                                color="success" 
                                fullWidth
                                type="submit"
                                :disabled="isSubmitting">
                                <span v-if="isSubmitting">
                                  <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                  Procesando...
                                </span>
                                <span v-else>
                                  {{ editingId ? "Actualizar" : "Registrar" }}
                                </span>
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
              <!-- Tabla de productos -->
              <div class="mt-3 col-xl-7 col-lg-8 col-md-9 d-flex flex-column ms-auto me-auto ms-lg-auto me-sm-0">
                <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                  <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                    <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                      <h3 class="text-white text-success mb-0">
                        Productos disponibles
                      </h3>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive" style="max-height: 200px; overflow-y: auto;">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Producto</th>
                            <th scope="col">Tipo de Producto</th>
                            <th scope="col">En Stock</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Proveedor</th>
                            <th scope="col">Alerta</th>
                            <th scope="col">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="isLoading">
                            <td colspan="8" class="text-center">
                              <div class="spinner-border text-success" role="status">
                                <span class="visually-hidden">Cargando...</span>
                              </div>
                            </td>
                          </tr>
                          <tr v-for="lp in listProducts" :key="lp.id" v-else>
                            <td>{{ lp.id }}</td>
                            <td>{{ lp.product_name }}</td>
                            <td>{{ lp.product_type["product_type_name"] }}</td>
                            <td>{{ lp.stock }}</td>
                            <td>{{ lp.price }}</td>
                            <td>{{ lp.provider ?? '-' }}</td>
                            <td>
                              <div class="alert-warning" role="alert" v-if="lp.stock < 4 && lp.stock > 0">
                                <div style="color: white; text-align: center">
                                  Estás por quedarte sin producto!
                                </div>
                              </div>
                              <div class="alert-danger" role="alert" v-if="lp.stock == 0">
                                <div style="color: white; text-align: center">
                                  Fuera de stock
                                </div>
                              </div>
                            </td>
                            <td>
                              <!-- Edit Icon SVG -->
                              <button class="btn btn-link p-0 me-2" @click="editProduct(lp)" title="Editar">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                  <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.232 5.232l3.536 3.536M9 13.5V17h3.5l7.036-7.036a2.002 2.002 0 0 0 0-2.828l-3.672-3.672a2.002 2.002 0 0 0-2.828 0L9 7.5z" />
                                </svg>
                              </button>
                              <!-- Delete Icon SVG -->
                              <button class="btn btn-link p-0" @click="deleteProduct(lp.id)" title="Eliminar">
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
