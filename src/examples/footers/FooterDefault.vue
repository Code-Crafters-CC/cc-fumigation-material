<script setup>
import logoDark from "@/assets/img/logo-ct-dark.png";
defineProps({
  brand: {
    type: Object,
    name: String,
    logo: String,
    route: "",
    default: () => ({
      name: "Fumigations / Material Kit 2",
      logo: logoDark,
      route: "/"
    })
  },
});
</script>
<template>
  <footer class="footer pt-5 mt-5">
    <div class="container">
      <div class="row align-self-center">
        <div class="col-12">
          <div class="text-center">
            <p class="text-dark my-4 text-sm font-weight-normal">
              All rights reserved. Copyright ©
              {{ new Date().getFullYear() }}
              Fumigaciones Oliva Gómez  developed by
              <a href="https://www.facebook.com/christian.requena.79" target="_blank"
                >Christian Requena</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
