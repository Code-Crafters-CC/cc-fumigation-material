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
    async autoLogin() {
      const tokenStr = localStorage.getItem(TOKEN_KEY);
      const rol = localStorage.getItem(ROL_KEY);

      console.log("[autoLogin] Token encontrado en localStorage?", !!tokenStr, "Rol:", rol);

      if (tokenStr) {
        const token = JSON.parse(tokenStr);
        if (!isTokenExpired(token)) {
          // Verifica el usuario llamando al endpoint profile
          try {
            const resp = await axios.get('/api/user/profile/', {
              headers: { Authorization: `Bearer ${token.access || token}` }
            });
            // Si la respuesta es exitosa, actualiza el rol si viene del backend
            if (resp.status === 200 && resp.data) {
              console.log("[autoLogin] Usuario recuperado del backend:", resp.data);
              this.token = token;
              this.rol = resp.data.rol?.rol_name || rol;
              localStorage.setItem(ROL_KEY, this.rol);
              return;
            } else {
              console.log("[autoLogin] Respuesta inesperada en profile:", resp.status, resp.data);
            }
          } catch (e) {
            console.log("[autoLogin] Token inválido en backend o usuario no existe. Cerrando sesión.", e);
            this.salir();
            return;
          }
        } else {
          console.log("[autoLogin] Token expirado, cerrando sesión.");
        }
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
        console.log("[autoLogin] No hay token en localStorage.");
      }
      this.salir();
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
