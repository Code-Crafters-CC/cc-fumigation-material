<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAppStore } from "@/stores/index";
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import setMaterialInput from "@/assets/js/material-input";

const store = useAppStore();

const user = ref({
    first_name: "",
    last_name: "",
    email: "",
});
const password = ref(""); // Nuevo campo para cambiar password (opcional)
const editing = ref(false);
const changingPassword = ref(false);
const loading = ref(false);

const fetchProfile = async () => {
    loading.value = true;
    try {
        const response = await axios.get("/api/user/profile/", {
            headers: { Authorization: `Bearer ${store.token.access}` },
        });
        user.value = response.data;
    } catch (error) {
        console.error(error);
    }
    loading.value = false;
};

const updateProfile = async () => {
    try {
        loading.value = true;
        const payload = {
            first_name: user.value.first_name,
            last_name: user.value.last_name,
            email: user.value.email,
        };
        if (changingPassword.value && password.value) {
            payload.password = password.value;
        }
        await axios.patch("/api/user/profile/", payload, {
            headers: { Authorization: `Bearer ${store.token.access}` },
        });
        editing.value = false;
        changingPassword.value = false;
        password.value = "";
        await fetchProfile();
    } catch (error) {
        console.error(error);
    }
    loading.value = false;
};

const deleteProfile = async () => {
    if (
        !confirm(
            "¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
        )
    )
        return;
    try {
        loading.value = true;
        await axios.delete(`/users/${user.value.id}/`, {
            headers: { Authorization: `Bearer ${store.token.access}` },
        });
        alert("Tu cuenta ha sido eliminada.");
        // Aquí podrías hacer logout y redirigir
        // store.logout();
        // window.location.href = "/";
    } catch (error) {
        console.error(error);
    }
    loading.value = false;
};

onMounted(() => {
    setMaterialInput();
    fetchProfile();
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
                    <div class="col-md-6 d-flex flex-column mx-auto mt-4 mt-md-0">
                        <div class="card d-flex blur justify-content-center shadow-lg my-sm-0 my-sm-6 mt-8 mb-5">
                            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                <div class="bg-gradient-success shadow-success border-radius-lg p-3">
                                    <h3 class="text-white font-weight-bolder text-center mt-2 mb-0">
                                        Mi Perfil
                                    </h3>
                                </div>
                            </div>
                            <div class="card-body">
                                <form role="form" id="profile-form" method="post" autocomplete="off"
                                    @submit.prevent="updateProfile">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label class="form-label">Nombre</label>
                                                <input v-model="user.first_name" :readonly="!editing"
                                                    class="form-control" type="text" placeholder="Nombre" />
                                            </div>
                                            <div class="col-md-6 ps-2">
                                                <label class="form-label">Apellido</label>
                                                <input v-model="user.last_name" :readonly="!editing"
                                                    class="form-control" type="text" placeholder="Apellido" />
                                            </div>
                                            <div class="col-md-12 mt-3">
                                                <label class="form-label">Email</label>
                                                <input v-model="user.email" :readonly="!editing"
                                                    class="form-control" type="email" placeholder="Email" />
                                            </div>
                                            <div class="col-md-12 mt-3" v-if="editing">
                                                <label class="form-label">Contraseña nueva</label>
                                                <input v-model="password" class="form-control" type="password"
                                                    placeholder="Dejar vacío para no cambiar" />
                                                <small class="text-muted">Deja vacío para mantener la contraseña actual.</small>
                                            </div>
                                            <div class="mb-4 mt-4 text-center">
                                                <MaterialButton v-if="!editing" class="my-2" variant="gradient"
                                                    color="success" fullWidth @click="editing = true">
                                                    Editar Perfil
                                                </MaterialButton>
                                                <MaterialButton v-if="editing" class="my-2" variant="gradient"
                                                    color="success" fullWidth type="submit" :disabled="loading">
                                                    Guardar Cambios
                                                </MaterialButton>
                                                <MaterialButton v-if="editing" class="my-2" variant="outlined"
                                                    color="dark" fullWidth @click="editing = false">
                                                    Cancelar
                                                </MaterialButton>
                                                <MaterialButton class="my-2" variant="outlined" color="danger" fullWidth
                                                    @click="deleteProfile" :disabled="loading">
                                                    Eliminar cuenta
                                                </MaterialButton>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div v-if="loading" class="text-center text-success mt-2">
                                    Cargando...
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