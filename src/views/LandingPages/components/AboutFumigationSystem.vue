<script setup>
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import DefaultFooter from "@/examples/footers/FooterDefault.vue";

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
        <div class="container my-8 mt-8">
            <h2 class="text-success mb-6">¿Qué es Fumigations System?</h2>
            <p>
                Fumigations System es una plataforma web diseñada para facilitar la gestión integral de servicios de
                fumigación, permitiendo a empresas y clientes programar, monitorear y analizar todas las actividades
                relacionadas con el control de plagas de manera eficiente, segura y transparente.
            </p>
        </div>
    </section>
    <DefaultFooter />
</template>