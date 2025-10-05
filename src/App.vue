<script setup>
/*
=========================================================
* Vue Material Kit 2 - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-material-kit
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import StockNotifications from "@/components/StockNotifications.vue";
import StockNotificationService from "@/data/StockNotificationService.js";

const stockNotificationsRef = ref(null);

onMounted(() => {
  // Registrar el componente de notificaciones en el servicio
  if (stockNotificationsRef.value) {
    StockNotificationService.setNotificationComponent(stockNotificationsRef.value);
  }
});
</script>

<template>
  <router-view />
  <StockNotifications ref="stockNotificationsRef" />
</template>
