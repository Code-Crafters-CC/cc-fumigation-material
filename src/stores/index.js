import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import { defineStore } from 'pinia'
import router from '../router/index'

const TOKEN_EXP_KEY = 'token_exp';
const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const jwt = typeof token === 'object' && token.access ? token.access : token;
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    if (!payload.exp) return true;
    return Date.now() / 1000 > payload.exp;
  } catch (e) {
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
      this.token = token; // Save object (access, refresh)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
      localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
      localStorage.setItem(TOKEN_EXP_KEY, expiresAt);
    },
    guardarRol(rol) {
      this.rol = rol;
      localStorage.setItem(ROL_KEY, rol);
    },
    autoLogin() {
      const tokenStr = localStorage.getItem(TOKEN_KEY);
      const rol = localStorage.getItem(ROL_KEY);

      if (tokenStr) {
        const token = JSON.parse(tokenStr);
        if (!isTokenExpired(token)) {
          this.token = token;
          this.rol = rol;
          router.push({ name: "about" });
          return;
        }
      }
      this.salir();
    },
    salir() {
      this.token = null;
      this.rol = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROL_KEY);
      localStorage.removeItem(TOKEN_EXP_KEY);
      router.push({ name: "login" });
    },
    checkTokenOrLogout() {
      if (isTokenExpired(this.token)) {
        this.salir();
        return false;
      }
      return true;
    }
  },
});
