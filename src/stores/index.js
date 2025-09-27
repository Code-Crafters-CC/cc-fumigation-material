import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import { defineStore } from 'pinia'
import router from '../router/index'
import axios from "axios"; // <-- Necesario para la llamada al backend
import "@/interceptor/axios"

const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';

function isTokenExpired(token) {
  if (!token) {
    console.log("[isTokenExpired] No token presente.");
    return true;
  }
  try {
    const jwt = typeof token === 'object' && token.access ? token.access : token;
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    if (!payload.exp) {
      console.log("[isTokenExpired] El token no tiene campo 'exp'.");
      return true;
    }
    const expired = Date.now() / 1000 > payload.exp;
    console.log(`[isTokenExpired] Token expira en: ${new Date(payload.exp * 1000).toISOString()}. ¿Expiró?: ${expired}`);
    return expired;
  } catch (e) {
    console.log("[isTokenExpired] Error al parsear token:", e);
    return true;
  }
}

export const useAppStore = defineStore("auth", {
  state: () => ({
    bootstrap,
    token: localStorage.getItem(TOKEN_KEY)
      ? JSON.parse(localStorage.getItem(TOKEN_KEY))
      : null,
    rol: localStorage.getItem(ROL_KEY) || null,
  }),
  actions: {
    guardarToken(token) {
      console.log("[guardarToken] Guardando token:", token);
      this.token = token; 
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    },
    guardarRol(rol) {
      console.log("[guardarRol] Guardando rol:", rol);
      this.rol = rol;
      localStorage.setItem(ROL_KEY, rol);
    },
    autoLogin() {
      let tokenStr = localStorage.getItem('token');
      let rol = localStorage.getItem('rol');
      if (tokenStr) {
        this.token = JSON.parse(tokenStr);
        this.rol = rol;
        
        // Verificar stock si es administrador al hacer auto-login
        if (rol === "2" || rol === 2 || rol === "Administrador") {
          // Importar dinámicamente para evitar problemas de dependencias circulares
          import('@/data/StockNotificationService.js').then((module) => {
            const StockNotificationService = module.default;
            setTimeout(() => {
              StockNotificationService.checkAndNotifyStockLevels(rol);
            }, 1500);
          });
        }
        
        router.push({ name: 'about' });
      } else {
        router.push({ name: 'login' });
      }
    },
    salir() {
      console.log("[salir] Cerrando sesión.");
      
      // Detener monitoreo de stock al cerrar sesión
      import("@/data/StockNotificationService.js").then((module) => {
        const StockNotificationService = module.default;
        StockNotificationService.stopMonitoring();
      });
      
      this.token = null;
      this.rol = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROL_KEY);
      router.push({ name: "login" });
    },
    checkTokenOrLogout() {
      const expired = isTokenExpired(this.token);
      console.log(`[checkTokenOrLogout] ¿Token expirado?: ${expired}`);
      if (expired) {
        this.salir();
        return false;
      }
      return true;
    }
  },
  getters: {
    isAuthenticated: (state) => {
      const auth = !!state.token && !isTokenExpired(state.token);
      console.log(`[isAuthenticated] token:`, state.token, `rol:`, state.rol, `=>`, auth);
      return auth;
    },
  },
});
