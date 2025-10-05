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
            <h2 class="text-success mb-6">Nuestros Servicios</h2>
            <ul class="servicios-list" style="font-size:1.15rem; padding-left:1.2em; margin-bottom:2em;">
                <li>🪳 <b>Cucaracha alemana:</b> Especialistas en eliminar esta plaga común en cocinas y lugares
                    cálidos. Reproducción rápida y difícil de controlar sin tratamiento profesional.</li>
                <li>🪰 <b>Cucaracha voladora o de drenaje:</b> Eliminamos cucarachas grandes y voladoras que suelen
                    vivir en desagües, alcantarillas y lugares húmedos. Usamos productos efectivos que llegan a sus
                    nidos.</li>
                <li>🐜 <b>Hormigas:</b> Tratamiento para eliminar hormigueros desde la raíz, evitando que invadan
                    cocinas, jardines o áreas de trabajo. Control preventivo y correctivo.</li>
                <li>🕷️ <b>Pulgas y garrapatas:</b> Fumigación especializada para proteger a tu familia y mascotas.
                    Eliminamos estos parásitos de interiores, patios y jardines.</li>
                <li>🛏️ <b>Chinches de cama:</b> Tratamientos potentes para erradicar chinches en colchones, camas y
                    muebles. Atacamos todas las etapas del insecto para evitar reinfestaciones.</li>
                <li>🦟 <b>Zancudos e insectos voladores:</b> Control de mosquitos, zancudos y otros insectos que vuelan
                    y transmiten enfermedades. Ideal para interiores, exteriores y zonas húmedas.</li>
                <li>🦂 <b>Alacranes:</b> Aplicamos técnicas de control para reducir alacranes en viviendas y terrenos.
                    Eliminamos escondites y aplicamos barreras químicas.</li>
                <li>🐍 <b>Culebras:</b> Desalojo y control de serpientes no venenosas en áreas residenciales o rurales.
                    Prevención mediante control de su hábitat y alimento.</li>
                <li>🐀 <b>Ratas y ratones:</b> Desratización completa de espacios mediante trampas, cebos y técnicas
                    seguras. Eliminamos roedores y evitamos su regreso.</li>
                <li>🪤 <b>Instalación de trampas para ratas y ratones:</b> Colocación estratégica de trampas seguras,
                    eficaces y adaptadas a cada tipo de ambiente. Ideal para casas, negocios o bodegas.</li>
                <li>☠️ <b>Aplicación de venenos en polvo y galletas especiales:</b> Uso de cebos sólidos y en polvo para
                    control de plagas difíciles. Productos seguros para humanos y mascotas, aplicados por profesionales.
                </li>
            </ul>
        </div>
    </section>
    <DefaultFooter />
</template>


<style scoped>
.servicios-list li {
    margin-bottom: 0.8em;
    line-height: 1.5;
}
</style>
