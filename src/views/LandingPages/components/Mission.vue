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
            <h2 class="text-success mb-6">Misión</h2>
            <p>
                Brindar servicios de fumigación y control de plagas de manera segura, efectiva y responsable,
                protegiendo la salud de las familias, los cultivos y el medio ambiente, garantizando la tranquilidad y
                satisfacción de nuestros clientes.
            </p>
        </div>
    </section>
    <DefaultFooter />
</template>