<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/index';

const store = useAppStore();

const canSeeCrud = computed(() => {
    // Solo muestra CRUDs si está autenticado y es Administrador o Fumigador
    if (!store.isAuthenticated) return false;
    if (!store.rol) return false;
    const rol = store.rol.toLowerCase();
    return rol === 'administrador' || rol === 'fumigador';
});

const isAuthenticated = computed(() => store.isAuthenticated);
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white px-4">
        <div class="d-flex align-items-center">
            <a class="navbar-brand d-flex align-items-center" href="/">
                <img src="@/assets/img/logo.png" alt="Logo" height="40" />
                <span class="ms-2 h4 mb-0 fw-bold text-success system-name">Fumigations System</span>
            </a>
        </div>
        <div class="collapse navbar-collapse justify-content-end">
            <ul class="navbar-nav align-items-center">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        ¿Quiénes Somos?
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#mision">Misión</a></li>
                        <li><a class="dropdown-item" href="#vision">Visión</a></li>
                    </ul>
                </li>
                <!-- Menús solo si NO está autenticado -->
                <li class="nav-item" v-if="!isAuthenticated">
                    <RouterLink :to="{ name: 'signin-basic' }" class="nav-link">
                        Login
                    </RouterLink>
                </li>
                <li class="nav-item" v-if="!isAuthenticated">
                    <a class="nav-link" href="https://wa.me/502XXXXXXXX" target="_blank">Soporte</a>
                </li>
                <!-- Menú hamburguesa solo para Admin y Fumigador autenticados -->
                <li v-if="canSeeCrud" class="nav-item dropdown ms-3">
                    <a class="nav-link dropdown-toggle" href="#" id="adminMenu" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-bars"></i> Servicios
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminMenu">
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'products' }">Crear Producto</RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'plagues' }">Registro de Plagas</RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'controlForm' }">Registro de Fumigaciones
                            </RouterLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { useAppStore } from "@/stores/index.js";

const authStore = useAppStore();
</script>

<style scoped>
.system-name {
    letter-spacing: 2px;
}
</style>
