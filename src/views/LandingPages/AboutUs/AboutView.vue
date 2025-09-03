<script setup>
import { onMounted, onUnmounted } from "vue";
import CustomNavbar from "../../../examples/navbars/CustomNavBar.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import bg0 from "@/assets/img/vue-mk-header.jpg";
import Typed from "typed.js";

const body = document.getElementsByTagName("body")[0];

onMounted(() => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  if (document.getElementById("typed")) {
    var typed = new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });
  }
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});
</script>

<template>
  <CustomNavbar />
  <!-- Banner principal -->
  <header class="bg-gradient-dark position-relative">
    <div class="page-header min-vh-75" :style="{ backgroundImage: `url(${bg0})` }">
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container h-100">
        <div class="row justify-content-center align-items-center h-100">
          <div class="col-lg-8 text-center mx-auto my-auto">
            <h1 class="text-white">
              Adiós a <span class="text-white" id="typed"></span>
            </h1>
            <div id="typed-strings">
              <h1>las plagas</h1>
              <h1>las alimañas</h1>
              <h1>los problemas</h1>
            </div>
            <p class="lead mb-4 text-white opacity-8">
              Nos especializamos en tratar con plagas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Tarjetas flotantes grandes debajo del banner -->
  <section class="floating-cards-section">
    <div class="floating-cards">
      <div class="floating-card">
        <i class="fas fa-globe-americas fa-2x text-success mb-2"></i>
        <h5 class="fw-bold">Comprometidos con el planeta</h5>
        <p class="text-muted">Utilizamos productos amigables con el medio ambiente.</p>
      </div>
      <div class="floating-card">
        <i class="fas fa-money-bill-wave fa-2x text-success mb-2"></i>
        <h5 class="fw-bold">Amigable con tu bolsillo</h5>
        <p class="text-muted">Tenemos los mejores precios del mercado.</p>
      </div>
      <div class="floating-card">
        <i class="fas fa-clipboard-check fa-2x text-success mb-2"></i>
        <h5 class="fw-bold">Bien Organizados</h5>
        <p class="text-muted">Sabemos cómo actuar contra las plagas, con experiencia y orden.</p>
      </div>
      <div class="floating-card">
        <i class="fas fa-clock fa-2x text-success mb-2"></i>
        <h5 class="fw-bold">De rápida respuesta</h5>
        <p class="text-muted">Nuestros expertos te contactarán en menos tiempo del que imaginas.</p>
      </div>
    </div>
  </section>

  <!-- Sección informativa orientada a fumigaciones y prevención -->
  <section class="info-section py-5">
    <div class="container text-center">
      <h2 class="fw-bold text-success mb-3">Por un ambiente seguro y libre de plagas</h2>
      <p class="fs-5 mb-4">
        Nuestros servicios de fumigación y prevención están diseñados para proteger tu hogar, negocio y comunidad.
        Ofrecemos métodos efectivos, productos responsables y asesoría en el cuidado preventivo de plagas.
      </p>
      <div class="row justify-content-center mb-4">
        <div class="col-md-4 mb-3">
          <img src="@/assets/img/fumigacion1.jpg" alt="Fumigación responsable" class="img-fluid rounded shadow" />
        </div>
        <div class="col-md-4 mb-3">
          <img src="@/assets/img/fumigacion2.jpg" alt="Prevención de plagas" class="img-fluid rounded shadow" />
        </div>
      </div>
      <a href="/solicitar-fumigacion" class="btn btn-success btn-lg mt-3">
        SOLICITA TU FUMIGACIÓN
      </a>
    </div>
  </section>
  <DefaultFooter />
</template>

<style scoped>
.floating-cards-section {
  display: flex;
  justify-content: center;
  margin-top: -4rem; 
  margin-bottom: 2rem;
  z-index: 12;
  position: relative;
}
.floating-cards {
  display: flex;
  gap: 2rem;
  background: transparent;
}
.floating-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(44, 62, 80, 0.12), 0 1.5px 4px rgba(44, 62, 80, 0.16);
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 240px;
  max-width: 300px;
  flex: 1 1 0;
  text-align: center;
  transition: box-shadow 0.3s, transform 0.3s;
  font-size: 1.1rem;
}
.floating-card:hover {
  box-shadow: 0 16px 32px rgba(44, 62, 80, 0.16), 0 3px 8px rgba(44, 62, 80, 0.32);
  transform: translateY(-6px) scale(1.03);
}
@media (max-width: 1100px) {
  .floating-cards {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
  .floating-cards-section {
    margin-top: 1.5rem;
  }
}
</style>