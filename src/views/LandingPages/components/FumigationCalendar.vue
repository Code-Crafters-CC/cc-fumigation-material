<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from "@/stores/index";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import setMaterialInput from "@/assets/js/material-input";
import image from "@/assets/img/illustrations/illustration-signin.jpg";

// Traducciones de status
const statusTranslation = {
    "REQUESTED": "Solicitado",
    "IN_PROGRESS": "En progreso",
    "COMPLETED": "Completada",
    "CANCELLED": "Cancelado"
};

const store = useAppStore();
const calendarEvents = ref([]);
const loading = ref(false);

// --- ALERTA POP-UP MODAL ---
const showAlert = ref(false);
const alertMessage = ref("");

// Utilidad para YYYY-MM-DD local
const pad = n => n < 10 ? '0' + n : n;
const formatToYYYYMMDD = (dateObj) => {
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth()+1)}-${pad(dateObj.getDate())}`;
};

// --- FECHAS ---
const today = new Date();
const startDate = ref(formatToYYYYMMDD(today)); // YYYY-MM-DD
const endDate = ref(formatToYYYYMMDD(new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()))); // Un mes adelante

// Modal y edición
const selectedFumigation = ref(null);
const showModal = ref(false);

// --- FUNC: Detecta fumigaciones próximas ---
const checkFumigationsSoon = () => {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + 2); // Próximos 2 días

    const todayDay = formatToYYYYMMDD(now);
    const soonDay = formatToYYYYMMDD(soon);

    // Cambia aquí: usa "requested_date" para alerta
    const proximas = calendarEvents.value.filter(evt => {
        if (!evt.requested_date) return false;
        const evtDate = new Date(evt.requested_date);
        const evtDay = formatToYYYYMMDD(evtDate);

        return evtDay >= todayDay && evtDay <= soonDay && evt.status_name === "REQUESTED";
    });

    if (proximas.length) {
        showAlert.value = true;
        alertMessage.value = `¡Tienes ${proximas.length} fumigaciones próximas! Por favor, revisa tu calendario.`;
    } else {
        showAlert.value = false;
    }
};

const loadCalendarEvents = async () => {
    loading.value = true;
    try {
        const response = await axios.get("fumigationRequest/", {
            params: {
                scheduled_start: startDate.value,
                scheduled_end: endDate.value,
            },
            headers: {
                Authorization: `Bearer ${store.token.access}`,
            }
        });
        calendarEvents.value = response.data;
        checkFumigationsSoon(); // <-- Llama a la función después de cargar los eventos
    } catch (error) {
        console.log(error);
    }
    loading.value = false;
};

const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-GT", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

const translateStatus = (status) => {
    return statusTranslation[status] || status;
};

const openDetails = (fumigation) => {
    selectedFumigation.value = { ...fumigation };
    if (selectedFumigation.value.scheduled_date) {
        selectedFumigation.value.scheduled_date = selectedFumigation.value.scheduled_date.slice(0, 16);
    }
    showModal.value = true;
};

const saveScheduledDate = async () => {
    try {
        await axios.patch(`fumigationRequest/${selectedFumigation.value.id}/`, {
            scheduled_date: selectedFumigation.value.scheduled_date,
        }, {
            headers: { Authorization: `Bearer ${store.token.access}` }
        });
        showModal.value = false;
        await loadCalendarEvents();
    } catch (error) {
        console.log(error);
        alert("Error al actualizar la fecha programada.");
    }
};

onMounted(() => {
    setMaterialInput();
    loadCalendarEvents();
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
                    
                    <!-- MODAL ALERTA POPUP -->
                    <div v-if="showAlert" class="modal fade show d-block" tabindex="-1"
                        style="background:rgba(0,0,0,0.3);position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;">
                        <div class="modal-dialog modal-dialog-centered" style="max-width: 400px;">
                            <div class="modal-content" style="border-radius:16px;box-shadow:0 12px 24px rgba(0,0,0,0.2);">
                                <div class="modal-header" style="padding:16px 24px;">
                                    <h5 class="modal-title" style="font-weight:bold;">¡Recordatorio!</h5>
                                </div>
                                <div class="modal-body" style="padding:20px 24px;">
                                    <p style="font-size:1.15rem; margin-bottom:12px;">{{ alertMessage }}</p>
                                </div>
                                <div class="modal-footer" style="padding:14px 24px;">
                                    <button class="btn btn-primary" style="min-width:90px;" @click="showAlert = false">
                                        Ok
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- CALENDARIO DE FUMIGACIONES -->
                    <div class="container py-4">
                        <div class="row justify-content-center">
                            <div class="col-md-10 d-flex flex-column mx-auto">
                                <div
                                    class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                                    <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                                        <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                                            <h3 class="text-white text-success mb-0">Calendario de Fumigaciones
                                                Programadas</h3>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div v-if="loading" class="text-center my-4">
                                            <span class="text-success">Cargando eventos...</span>
                                        </div>
                                        <div class="table-responsive" style="max-height: 500px; overflow-y:auto;"
                                            v-if="calendarEvents.length">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Nueva Fecha Programada</th>
                                                        <th>Cliente</th>
                                                        <th>Dirección</th>
                                                        <th>Plaga</th>
                                                        <th>Producto Sugerido</th>
                                                        <th>Estado</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="evt in calendarEvents" :key="evt.id">
                                                        <td>{{ evt.id }}</td>
                                                        <td>{{ formatDate(evt.scheduled_date) }}</td>
                                                        <td>{{ evt.client_name }} {{ evt.client_lastname }}</td>
                                                        <td>{{ evt.address }}</td>
                                                        <td>{{ evt.plague_name }}</td>
                                                        <td>{{ evt.product_name || '-' }}</td>
                                                        <td>
                                                            <span
                                                                :class="evt.status_name === 'COMPLETED' ? 'text-success' :
                                                                    evt.status_name === 'REQUESTED' ? 'text-warning' : 'text-secondary'">
                                                                {{ translateStatus(evt.status_name) }}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button class="btn btn-sm btn-outline-success"
                                                                title="Ver detalles" @click="openDetails(evt)">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18"
                                                                    height="18" fill="none" viewBox="0 0 24 24"
                                                                    stroke="currentColor" stroke-width="2">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div v-else class="text-center my-4">
                                            <span class="text-warning">No hay fumigaciones programadas en este
                                                rango.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- MODAL DE REPROGRAMACIÓN -->
                    <div v-if="showModal" class="modal fade show d-block" tabindex="-1"
                        style="background:rgba(0,0,0,0.3)">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Detalles de Fumigación</h5>
                                    <button type="button" class="btn-close" @click="showModal = false"></button>
                                </div>
                                <div class="modal-body">
                                    <p><b>Cliente:</b> {{ selectedFumigation.client_name }} {{
                                        selectedFumigation.client_lastname }}</p>
                                    <p><b>Fecha solicitada:</b> {{ formatDate(selectedFumigation.requested_date) }}</p>
                                    <p><b>Dirección:</b> {{ selectedFumigation.address }}</p>
                                    <p><b>Plaga:</b> {{ selectedFumigation.plague_name }}</p>
                                    <p><b>Producto:</b> {{ selectedFumigation.product_name || '-' }}</p>
                                    <p><b>Estado:</b> {{ translateStatus(selectedFumigation.status_name) }}</p>
                                    <div v-if="selectedFumigation.status_name === 'REQUESTED'">
                                        <label>Nueva fecha programada</label>
                                        <input type="datetime-local" v-model="selectedFumigation.scheduled_date"
                                            class="form-control" />
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-secondary" @click="showModal = false">Cerrar</button>
                                    <button v-if="selectedFumigation.status_name === 'REQUESTED'"
                                        class="btn btn-success" @click="saveScheduledDate">Guardar cambios</button>
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