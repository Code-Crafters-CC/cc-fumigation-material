<script setup>
import { ref, onMounted, computed } from "vue";
import ProductService from "@/data/ProductService.js";
//example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

//material components
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";

const products = ref([]);
const selectedProducts = ref({});
const loading = ref(false);

// Método para obtener productos
const fetchProducts = async () => {
  loading.value = true;
  try {
    const data = await ProductService.getProducts();
    products.value = data.filter((product) => product.is_active);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  } finally {
    loading.value = false;
  }
};

// Método para actualizar cantidad de producto seleccionado
const updateQuantity = (productId, quantity) => {
  if (quantity <= 0) {
    delete selectedProducts.value[productId];
  } else {
    selectedProducts.value[productId] = quantity;
  }
};

// Calcular subtotal de productos
const subtotal = computed(() => {
  return Object.keys(selectedProducts.value).reduce((total, productId) => {
    const product = products.value.find((p) => p.id == productId);
    if (product) {
      total += product.price * selectedProducts.value[productId];
    }
    return total;
  }, 0);
});

// Calcular mano de obra (15%)
const laborCost = computed(() => {
  return subtotal.value * 0.15;
});

// Total final
const total = computed(() => {
  return subtotal.value + laborCost.value;
});

// Obtener productos seleccionados con detalles
const selectedProductsDetails = computed(() => {
  return Object.keys(selectedProducts.value).map((productId) => {
    const product = products.value.find((p) => p.id == productId);
    return {
      ...product,
      quantity: selectedProducts.value[productId],
      itemTotal: product.price * selectedProducts.value[productId],
    };
  });
});

// Limpiar selección
const clearSelection = () => {
  selectedProducts.value = {};
};

onMounted(() => {
  setMaterialInput();
  fetchProducts();
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
  
  <section class="py-7">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
            >
              <div
                class="bg-gradient-success shadow-success border-radius-lg p-3"
              >
                <h3
                  class="text-white font-weight-bolder text-center mt-2 mb-0"
                >
                  Calculadora de Precios de Fumigación
                </h3>
              </div>
            </div>
            <div class="card-body">
              <div class="row">
                <!-- Lista de Productos -->
                <div class="col-lg-8">
                  <h5 class="font-weight-bolder mb-3">Seleccionar Productos</h5>
                  <div v-if="loading" class="text-center">
                    <div class="spinner-border text-success" role="status">
                      <span class="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                  <div v-else class="row">
                    <div
                      v-for="product in products"
                      :key="product.id"
                      class="col-md-6 mb-4"
                    >
                      <div class="card h-100 shadow-sm border">
                        <div class="card-body">
                          <div
                            class="d-flex justify-content-between align-items-start mb-2"
                          >
                            <h6 class="font-weight-bold text-dark mb-0">
                              {{ product.product_name }}
                            </h6>
                            <span class="badge bg-gradient-success">
                              {{ product.product_type.product_type_name }}
                            </span>
                          </div>
                          <p class="text-sm text-muted mb-2">
                            Stock disponible: {{ product.stock }} unidades
                          </p>
                          <p class="text-lg font-weight-bold text-success mb-3">
                            Q{{ product.price.toFixed(2) }}
                          </p>
                          <div class="d-flex align-items-center">
                            <label class="form-label text-sm me-2 mb-0">
                              Cantidad:
                            </label>
                            <input
                              type="number"
                              class="form-control form-control-sm"
                              style="width: 80px"
                              min="0"
                              :max="product.stock"
                              :value="selectedProducts[product.id] || 0"
                              @input="
                                updateQuantity(
                                  product.id,
                                  parseInt($event.target.value) || 0
                                )
                              "
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Resumen de Cotización -->
                <div class="col-lg-4">
                  <div class="card bg-gray-100">
                    <div class="card-header bg-gradient-dark">
                      <h5 class="text-white font-weight-bold mb-0">
                        Resumen de Cotización
                      </h5>
                    </div>
                    <div class="card-body">
                      <div
                        v-if="selectedProductsDetails.length === 0"
                        class="text-center text-muted"
                      >
                        <i class="fas fa-calculator fa-3x mb-3"></i>
                        <p>No hay productos seleccionados</p>
                      </div>
                      <div v-else>
                        <!-- Productos seleccionados -->
                        <div class="mb-3">
                          <h6 class="font-weight-bold">
                            Productos Seleccionados:
                          </h6>
                          <div
                            v-for="item in selectedProductsDetails"
                            :key="item.id"
                            class="d-flex justify-content-between align-items-center py-2 border-bottom"
                          >
                            <div>
                              <p class="text-sm font-weight-bold mb-0">
                                {{ item.product_name }}
                              </p>
                              <p class="text-xs text-muted mb-0">
                                {{ item.quantity }} x Q{{ item.price.toFixed(2) }}
                              </p>
                            </div>
                            <span class="text-sm font-weight-bold">
                              Q{{ item.itemTotal.toFixed(2) }}
                            </span>
                          </div>
                        </div>

                        <!-- Cálculos -->
                        <div class="mb-3">
                          <div class="d-flex justify-content-between mb-2">
                            <span>Subtotal Productos:</span>
                            <span class="font-weight-bold">Q{{ subtotal.toFixed(2) }}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-2">
                            <span>Mano de Obra (15%):</span>
                            <span class="font-weight-bold">Q{{ laborCost.toFixed(2) }}</span>
                          </div>
                          <hr>
                          <div class="d-flex justify-content-between">
                            <span class="font-weight-bold text-lg">Total:</span>
                            <span class="font-weight-bold text-lg text-success">
                              Q{{ total.toFixed(2) }}
                            </span>
                          </div>
                        </div>

                        <!-- Botones -->
                        <div class="d-grid gap-2">
                          <MaterialButton
                            class="btn bg-gradient-success"
                            @click="clearSelection"
                          >
                            <i class="fas fa-trash me-1"></i>
                            Limpiar Selección
                          </MaterialButton>
                          <MaterialButton
                            class="btn bg-gradient-info"
                            @click="window.print()"
                          >
                            <i class="fas fa-print me-1"></i>
                            Imprimir Cotización
                          </MaterialButton>
                        </div>
                      </div>
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
</template><style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
}

.badge {
  font-size: 0.75rem;
}

@media print {
  .btn {
    display: none !important;
  }
  
  .card {
    box-shadow: none !important;
    border: 1px solid #dee2e6 !important;
  }
}
</style>