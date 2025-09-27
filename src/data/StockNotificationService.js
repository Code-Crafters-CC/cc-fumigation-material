import ProductService from "./ProductService.js";

class StockNotificationService {
  constructor() {
    this.notificationComponent = null;
    this.intervalId = null;
    this.lastCriticalProducts = [];
    this.snoozedUntil = null;
    this.isInitialLogin = true;
  }

  setNotificationComponent(component) {
    this.notificationComponent = component;
  }

  async checkAndNotifyStockLevels(userRole, isPeriodicCheck = false) {
    console.log("[StockNotificationService] Verificando stock para rol:", userRole, isPeriodicCheck ? "(verificación periódica)" : "(login inicial)");
    
    // Solo verificar para administradores (rol 2 o "Administrador")
    if (userRole !== 2 && userRole !== "2" && userRole !== "Administrador") {
      console.log("[StockNotificationService] Rol no autorizado:", userRole);
      return;
    }

    // Verificar si está en modo snooze
    if (isPeriodicCheck && this.snoozedUntil && new Date() < this.snoozedUntil) {
      console.log("[StockNotificationService] En modo snooze hasta:", this.snoozedUntil);
      return;
    }

    console.log("[StockNotificationService] Rol autorizado, obteniendo productos...");
    
    try {
      const products = await ProductService.getProducts();
      console.log("[StockNotificationService] Productos obtenidos:", products);
      
      if (this.notificationComponent && products) {
        console.log("[StockNotificationService] Verificando niveles de stock...");
        
        // Analizar productos críticos (stock 0-5)
        const criticalProducts = products.filter(p => 
          p.is_active && p.stock >= 0 && p.stock <= 5
        );
        
        if (isPeriodicCheck) {
          // Solo notificar en verificaciones periódicas si hay productos críticos
          if (criticalProducts.length > 0) {
            this.notificationComponent.checkStockLevels(products, true); // true = modo silencioso
          }
        } else {
          // Primera verificación (login) - mostrar todas las notificaciones
          this.notificationComponent.checkStockLevels(products, false);
          this.isInitialLogin = false;
        }
        
        // Actualizar lista de productos críticos
        this.lastCriticalProducts = criticalProducts;
        
        // Iniciar monitoreo periódico si hay productos críticos
        this.startPeriodicMonitoring(userRole);
        
      } else {
        console.log("[StockNotificationService] No hay componente o productos:", {
          component: !!this.notificationComponent,
          products: !!products
        });
      }
    } catch (error) {
      console.error("Error checking stock levels:", error);
      if (this.notificationComponent) {
        this.notificationComponent.addNotification(
          "Error",
          "No se pudieron verificar los niveles de stock",
          "danger",
          "fas fa-exclamation-triangle"
        );
      }
    }
  }

  startPeriodicMonitoring(userRole) {
    // Limpiar intervalo anterior si existe
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Solo iniciar monitoreo si hay productos críticos
    if (this.lastCriticalProducts.length > 0) {
      console.log("[StockNotificationService] Iniciando monitoreo periódico cada 5 minutos...");
      
      this.intervalId = setInterval(() => {
        this.checkAndNotifyStockLevels(userRole, true);
      }, 5 * 60 * 1000); // 5 minutos
    } else {
      console.log("[StockNotificationService] No hay productos críticos, no se inicia monitoreo");
    }
  }

  snoozeNotifications(minutes = 30) {
    this.snoozedUntil = new Date(Date.now() + minutes * 60 * 1000);
    console.log("[StockNotificationService] Notificaciones silenciadas hasta:", this.snoozedUntil);
    
    if (this.notificationComponent) {
      this.notificationComponent.addNotification(
        "🔕 Notificaciones Silenciadas",
        `Las alertas de stock se pausaron por ${minutes} minutos`,
        "info",
        "fas fa-bell-slash"
      );
    }
  }

  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[StockNotificationService] Monitoreo periódico detenido");
    }
  }

  addCustomNotification(title, message, type = "info", icon = "fas fa-info-circle") {
    if (this.notificationComponent) {
      this.notificationComponent.addNotification(title, message, type, icon);
    }
  }
}

// Exportar una instancia única (singleton)
export default new StockNotificationService();