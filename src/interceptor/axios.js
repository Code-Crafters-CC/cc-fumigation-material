import axios from "axios";
import { useAppStore } from "@/stores/index";

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            const store = useAppStore();
            store.salir();
        }
        return Promise.reject(error);
    }
);