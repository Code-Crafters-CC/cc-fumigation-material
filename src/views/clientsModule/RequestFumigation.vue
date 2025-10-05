<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from "@/stores";
import MaterialButton from "@/components/MaterialButton.vue";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustration-signin.jpg";

const store = useAppStore();
const requested_date = ref("");
const address = ref("");
const plague = ref("");
const temperature = ref("");
const notes = ref("");

const listPlagues = ref([]);

const loading = ref(false);
const success = ref(false);

const fetchPlagues = async () => {
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

const submitFumigationRequest = async () => {
    loading.value = true;
    try {
        await axios.post(
            "/fumigationRequest/",
            {
                requested_date: requested_date.value,
                address: address.value,
                plague: plague.value,
                temperature: temperature.value || null,
                notes: notes.value || "",
            },
            {
                headers: { Authorization: `Bearer ${store.token.access}` },
            }
        );
        success.value = true;
        // Limpia el formulario si quieres
        requested_date.value = "";
        address.value = "";
        plague.value = "";
        temperature.value = "";
        notes.value = "";
    } catch (e) {
        alert("Error al registrar la solicitud. Revisa los datos.");
        console.log(e);
    }
    loading.value = false;
};

onMounted(() => {
    setMaterialInput();
    fetchPlagues();
});
</script>

<template>
    <div class="container position-sticky z-index-sticky top-0">
        <div class="row">
            <div class="col-12">
                <DefaultNavbar :sticky="true" />
            </div>
        </div>
    </div>
    <section>
        <div class="page-header min-vh-100">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-6 d-flex flex-column mx-auto mt-4 mt-md-0">
                        <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                                    <h3 class="text-white font-weight-bolder text-center mt-2 mb-0">
                                        Solicitar Fumigación
                                    </h3>
                                </div>
                            </div>
                            <div class="card-body">
                                <form role="form" autocomplete="off" @submit.prevent="submitFumigationRequest">
                                    <div class="row">
                                        <div class="col-md-12 mb-3">
                                            <label class="form-label">Fecha y hora solicitada</label>
                                            <input v-model="requested_date" type="datetime-local" class="form-control"
                                                required />
                                        </div>
                                        <div class="col-md-12 mb-3">
                                            <label class="form-label">Dirección</label>
                                            <input v-model="address" type="text" class="form-control"
                                                placeholder="Ej. 8va calle, zona 1 San Marcos" required />
                                        </div>
                                        <div class="col-md-12 mb-3">
                                            <label class="form-label">Plaga</label>
                                            <select v-model="plague" class="form-select" required>
                                                <option value="" disabled>Selecciona una plaga</option>
                                                <option v-for="pl in listPlagues" :key="pl.id" :value="pl.id">
                                                    {{ pl.plague_name }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-md-12 mb-3">
                                            <label class="form-label">Temperatura (opcional)</label>
                                            <input v-model="temperature" type="number" class="form-control" min="0"
                                                max="50" step="0.1" placeholder="Ej. 27.5" />
                                        </div>
                                        <div class="col-md-12 mb-3">
                                            <label class="form-label">Notas adicionales (opcional)</label>
                                            <textarea v-model="notes" class="form-control"
                                                placeholder="Describe detalles adicionales si lo deseas"
                                                rows="2"></textarea>
                                        </div>
                                    </div>
                                    <div class="mb-4 mt-4 text-center">
                                        <MaterialButton class="my-2" variant="gradient" color="success" fullWidth
                                            type="submit" :disabled="loading">
                                            {{ loading ? "Enviando..." : "Solicitar Fumigación" }}
                                        </MaterialButton>
                                        <div v-if="success" class="text-success mt-2">
                                            ¡Solicitud enviada correctamente!
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <DefaultFooter />
</template>