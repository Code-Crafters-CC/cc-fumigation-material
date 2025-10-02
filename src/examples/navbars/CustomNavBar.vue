<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/index';
import { useRouter } from 'vue-router';

const store = useAppStore();
const router = useRouter();

const isAuthenticated = computed(() => store.isAuthenticated);

const isAdmin = computed(() => {
    return store.isAuthenticated && store.rol && store.rol.toLowerCase() === 'administrador';
});

const isFumigator = computed(() => {
    return store.isAuthenticated && store.rol && store.rol.toLowerCase() === 'fumigador';
});

const isClient = computed(() => {
    return store.isAuthenticated && store.rol && store.rol.toLowerCase() === 'cliente';
});

const salir = async () => {
    try {
        await store.salir();
        // La redirección ya se maneja en el store
    } catch (error) {
        console.error('Error durante logout:', error);
        // Redirección de fallback
        router.push({ name: "about" });
    }
};
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
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'about-fumigation-system' }">
                                ¿Qué es Fumigations System?
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'mission' }">
                                Misión
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'vision' }">
                                Visión
                            </RouterLink>
                        </li>
                    </ul>
                </li>
                <!-- Menús solo si NO está autenticado -->
                <li class="nav-item" v-if="!isAuthenticated">
                    <RouterLink :to="{ name: 'signin-basic' }" class="nav-link">
                        Login
                    </RouterLink>
                </li>
                <li class="nav-item" v-if="!isAuthenticated">
                    <a class="nav-link" href="https://wa.me/50212345678?text=Hola%20necesito%20soporte%20con%20la%20plataforma" target="_blank">Soporte</a>
                </li>

                <!-- Menú hamburguesa solo para Admin y Fumigador autenticados -->
                <li v-if="isAdmin || isFumigator" class="nav-item dropdown ms-3">
                    <a class="nav-link dropdown-toggle" href="#" id="adminMenu" role="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-bars"></i> Servicios
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="adminMenu">
                        <!-- CRUD Usuarios SOLO para Administrador -->
                        <li v-if="isAdmin">
                            <RouterLink class="dropdown-item" :to="{ name: 'users' }">Control de Usuarios</RouterLink>
                        </li>
                        <!-- Calculadora de Precios SOLO para Administrador -->
                        <li v-if="isAdmin">
                            <RouterLink class="dropdown-item" :to="{ name: 'price-calculator' }">Calculadora de Precios</RouterLink>
                        </li>
                        <!-- Centro de Reportes SOLO para Administrador -->
                        <li v-if="isAdmin">
                            <RouterLink class="dropdown-item" :to="{ name: 'reports' }">
                                <i class="fas fa-chart-bar me-1"></i>
                                Centro de Reportes
                            </RouterLink>
                        </li>
                        <!-- Servicios para ambos -->
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'products' }">Control de Productos</RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'plagues' }">Registro de Plagas</RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'controlForm' }">Control de Fumigaciones
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'contactus' }">Historial de fumigaciones y consumo
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'fumigation-calendar' }">Calendario de Fumigaciones
                            </RouterLink>
                        </li>
                    </ul>
                </li>

                <!-- Solo para clientes autenticados -->
                <li v-if="isClient" class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        Mi cuenta
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'client-profile' }">
                                Mi perfil
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'client-request-fumigation' }">
                                Solicitar Fumigación
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink class="dropdown-item" :to="{ name: 'client-my-fumigations' }">
                                Mis Fumigaciones
                            </RouterLink>
                        </li>
                    </ul>
                </li>

                <!-- Botón de Logout para usuarios autenticados -->
                <li class="nav-item" v-if="isAuthenticated">
                    <a 
                        class="nav-link text-danger cursor-pointer d-flex align-items-center" 
                        @click="salir"
                        role="button"
                    >
                        <i class="fas fa-sign-out-alt me-2"></i>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
.system-name {
    letter-spacing: 2px;
}

.navbar .dropdown-menu {
    min-width: 200px;
}

.cursor-pointer {
    cursor: pointer;
}

.nav-link.text-danger:hover {
    color: #dc3545 !important;
    text-decoration: none;
    opacity: 0.8;
}
</style>