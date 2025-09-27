<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from "@/stores";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import image from "@/assets/img/illustration-signin.jpg";

const store = useAppStore();
const listFumigations = ref([]);
const loading = ref(false);

const fields = [
    "#",
    "Fecha solicitada",
    "Dirección",
    "Plaga",
    "Estado",
    "Notas",
];

const statusTranslation = {
    "REQUESTED": "Solicitado",
    "IN_PROGRESS": "En progreso",
    "COMPLETED": "Completado",
    "CANCELLED": "Cancelado",
};

const getFumigations = async () => {
    loading.value = true;
    try {
        const response = await axios.get("/fumigationRequest/", {
            headers: { Authorization: `Bearer ${store.token.access}` }
        });
        listFumigations.value = response.data;
    } catch (e) {
        console.log(e);
    }
    loading.value = false;
};

onMounted(() => {
    getFumigations();
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
                    <div class="col-xl-8 col-lg-9 col-md-10 d-flex flex-column mx-auto mt-4 mt-md-0">
                        <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5"
                            style="margin-top: 60px; margin-left: 30px; padding: 50px 20px 15px 5px;">
                            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                                    <h3 class="text-white text-success mb-0">Mis Fumigaciones</h3>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive" style="max-height: 500px; overflow-y:auto;">
                                    <table class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Fecha solicitada</th>
                                                <th>Dirección</th>
                                                <th>Plaga</th>
                                                <th>Estado</th>
                                                <th>Notas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="f in listFumigations" :key="f.id">
                                                <td>{{ f.id }}</td>
                                                <td>{{ f.requested_date }}</td>
                                                <td>{{ f.address }}</td>
                                                <td>{{ f.plague_name }}</td>
                                                <td>{{ statusTranslation[f.status_name] || f.status_name }}</td>
                                                <td>{{ f.notes }}</td>
                                            </tr>
                                            <tr v-if="!loading && listFumigations.length === 0">
                                                <td colspan="6" class="text-center">No tienes fumigaciones registradas.
                                                </td>
                                            </tr>
                                            <tr v-if="loading">
                                                <td colspan="6" class="text-center">Cargando...</td>
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