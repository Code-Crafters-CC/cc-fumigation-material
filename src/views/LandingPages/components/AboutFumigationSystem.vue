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
            <h2 class="text-success mb-6">¿Quiénes Somos?</h2>
            <p>
                Fundada por Carlos Antonio Oliva Barrios, iniciamos un emprendimiento con recursos limitados pero con
                una visión clara: ofrecer un servicio de calidad que proteja tanto la salud de las familias como la
                productividad de los cultivos.
                Fumigaciones Oliva Gómez nace en el corazón de Malacatán, San Marcos, como una empresa local
                comprometida con la salud, la productividad y el bienestar de nuestra comunidad. Nos especializamos en
                el control de plagas en hogares, pequeños comercios y parcelas agrícolas, brindando soluciones
                efectivas, seguras y responsables con el medio ambiente.
                Nuestra empresa surge como respuesta a una necesidad urgente en la región: contar con un servicio
                confiable y profesional que enfrente los problemas de plagas domésticas y agrícolas, los cuales pueden
                generar pérdidas económicas, riesgos sanitarios y daños ambientales.
                Actualmente, trabajamos para expandir nuestros servicios a fincas y comunidades agrícolas, atendiendo
                cultivos clave como el maíz, frijol, café y banano, siempre con tratamientos especializados y asesoría
                preventiva.
            </p>
        </div>
    </section>
    <DefaultFooter />
</template>