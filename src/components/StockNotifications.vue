<template>
  <div class="stock-notifications">
    <transition-group
      name="notification"
      tag="div"
      class="notification-container"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'notification',
          'alert',
          `alert-${notification.type}`,
          'alert-dismissible',
          'fade',
          'show',
        ]"
      >
        <div class="d-flex align-items-center justify-content-between w-100">
          <div class="d-flex align-items-center">
            <i :class="notification.icon" class="me-2"></i>
            <div>
              <strong>{{ notification.title }}</strong>
              <p class="mb-0 text-sm">{{ notification.message }}</p>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <!-- Botón de snooze solo para notificaciones de tipo snooze -->
            <button
              v-if="notification.isSnooze"
              type="button"
              class="btn btn-sm btn-outline-secondary me-2"
              @click="handleSnooze()"
              title="Silenciar por 30 minutos"
            >
              <i class="fas fa-bell-slash"></i> Silenciar
            </button>
            <button
              type="button"
              class="btn-close"
              @click="removeNotification(notification.id)"
            ></button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from "vue";

const notifications = ref([]);
let notificationId = 0;

const addNotification = (
  title,
  message,
  type = "info",
  icon = "fas fa-info-circle"
) => {
  const id = ++notificationId;
  const notification = {
    id,
    title,
    message,
    type,
    icon,
  };
  
  notifications.value.push(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeNotification(id);
  }, 5000);
  
  return id;
};

const removeNotification = (id) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const checkStockLevels = (products, silentMode = false) => {
  console.log("[StockNotifications] Verificando stock de productos:", products, "Modo silencioso:", silentMode);
  
  if (!products || !Array.isArray(products)) {
    console.log("[StockNotifications] Productos inválidos:", products);
    return;
  }
  
  const outOfStock = [];
  const criticalStock = [];
  const lowStock = [];
  
  products.forEach((product) => {
    if (!product.is_active) {
      console.log("[StockNotifications] Saltando producto inactivo:", product.product_name);
      return; // Skip inactive products
    }
    
    const stock = product.stock;
    const productInfo = `${product.product_name} (${product.product_type.product_type_name})`;
    
    console.log(`[StockNotifications] Analizando ${productInfo}: stock=${stock}`);
    
    if (stock === 0) {
      console.log(`[StockNotifications] Sin stock: ${productInfo}`);
      outOfStock.push(productInfo);
    } else if (stock >= 1 && stock <= 5) {
      console.log(`[StockNotifications] Stock crítico: ${productInfo}`);
      criticalStock.push({ name: productInfo, stock });
    } else if (stock >= 6 && stock <= 14) {
      console.log(`[StockNotifications] Stock bajo: ${productInfo}`);
      lowStock.push({ name: productInfo, stock });
    } else {
      console.log(`[StockNotifications] Stock óptimo: ${productInfo}`);
    }
  });
  
  // Show notifications based on stock levels
  if (outOfStock.length > 0) {
    const id = addNotification(
      silentMode ? "🔔 Recordatorio: Sin Stock" : "🚨 Productos Agotados",
      `Sin existencias: ${outOfStock.join(", ")}. ${silentMode ? "Recordatorio automático." : "¡Reabastecer inmediatamente!"}`,
      "danger",
      "fas fa-exclamation-triangle"
    );
    
    if (silentMode) {
      addSnoozeOption(id);
    }
  }
  
  if (criticalStock.length > 0) {
    const criticalList = criticalStock
      .map((item) => `${item.name} (${item.stock} unidades)`)
      .join(", ");
    const id = addNotification(
      silentMode ? "🔔 Recordatorio: Stock Crítico" : "⚠️ Stock Crítico",
      `${silentMode ? "Recordatorio: " : ""}Reabastecer pronto: ${criticalList}`,
      "warning",
      "fas fa-exclamation-circle"
    );
    
    if (silentMode) {
      addSnoozeOption(id);
    }
  }
  
  // En modo silencioso, no mostrar alertas de stock bajo (solo crítico y agotado)
  if (!silentMode && lowStock.length > 0) {
    const lowList = lowStock
      .map((item) => `${item.name} (${item.stock} unidades)`)
      .join(", ");
    addNotification(
      "📦 Stock Bajo",
      `Mantente al pendiente: ${lowList}`,
      "info",
      "fas fa-info-circle"
    );
  }
};

const addSnoozeOption = (notificationId) => {
  // Agregar un timeout para mostrar la opción de snooze después de 2 segundos
  setTimeout(() => {
    const notification = notifications.value.find((n) => n.id === notificationId);
    if (notification) {
      // Agregar botón de snooze a la notificación
      const snoozeId = ++notificationId;
      notifications.value.push({
        id: snoozeId,
        title: "🔕 ¿Silenciar Recordatorios?",
        message: "Puedes pausar las alertas de stock por 30 minutos",
        type: "info",
        icon: "fas fa-bell-slash",
        isSnooze: true,
      });
      
      // Auto-remove snooze option after 10 seconds
      setTimeout(() => {
        removeNotification(snoozeId);
      }, 10000);
    }
  }, 2000);
};

const handleSnooze = () => {
  // Importar dinámicamente el servicio
  import("@/data/StockNotificationService.js").then((module) => {
    const StockNotificationService = module.default;
    StockNotificationService.snoozeNotifications(30);
  });
  
  // Remover todas las notificaciones actuales
  notifications.value = [];
};

// Expose methods to parent components
defineExpose({
  checkStockLevels,
  addNotification,
  removeNotification,
  handleSnooze,
});
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.notification {
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
}

.alert-info {
  border-left-color: #17a2b8;
  background-color: #d1ecf1;
  border-color: #bee5eb;
  color: #0c5460;
}

.alert-warning {
  border-left-color: #ffc107;
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

.alert-danger {
  border-left-color: #dc3545;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.75;
}

.btn-close:focus {
  outline: none;
  opacity: 1;
}

@media (max-width: 768px) {
  .notification-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>