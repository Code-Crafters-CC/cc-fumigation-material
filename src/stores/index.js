import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import { defineStore } from 'pinia'
import router from '../router/index'

export const useAppStore = defineStore('auth', {
  state: () => ({
    bootstrap,
    token: null,
    rol: null,
  }),
  actions: {
    guardarToken(token) {
      this.token = token;
      localStorage.setItem('token', JSON.stringify(token));
    },
    guardarRol(rol) {
      this.rol = rol;
      localStorage.setItem('rol', rol);
    },
    autoLogin() {
      let tokenStr = localStorage.getItem('token');
      let rol = localStorage.getItem('rol');
      if (tokenStr) {
        this.token = JSON.parse(tokenStr);
        this.rol = rol;
        router.push({ name: 'about' });
      } else {
        router.push({ name: 'login' });
      }
    },
    salir() {
      this.token = null;
      this.rol = null;
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      router.push({ name: 'login' });
    },
  },
});
