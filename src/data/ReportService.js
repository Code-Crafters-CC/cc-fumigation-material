import axios from "axios";
import { useAppStore } from "../stores/index";

class ReportService {
  constructor() {
    this.baseURL = "";
  }

  // Método para obtener headers con autenticación
  getHeaders() {
    const appStore = useAppStore();
    const token = appStore.token
      ? typeof appStore.token === "object" && appStore.token.access
        ? appStore.token.access
        : appStore.token
      : null;

    if (!token) {
      throw new Error("No authentication token found.");
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // Método auxiliar para descargar archivos
  downloadFile(data, filename, contentType) {
    try {
      const blob = new Blob([data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      throw new Error("Error al descargar el archivo");
    }
  }

  // Método para generar nombre de archivo con timestamp
  generateFilename(prefix, extension) {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[T:]/g, "_");
    return `${prefix}_${timestamp}.${extension}`;
  }

  // ===== REPORTES DE FUMIGACIONES =====

  /**
   * Obtener reporte de fumigaciones en JSON
   * @param {Object} filters - Filtros opcionales { start_date, end_date, status, client_id }
   */
  async getFumigationReportJSON(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.status) params.append("status", filters.status);
      if (filters.client_id) params.append("client_id", filters.client_id);

      const response = await axios.get(
        `fumigationRequest/reports/json/?${params.toString()}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fumigation report JSON:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
      }
      if (error.response?.status === 403) {
        throw new Error("No tiene permisos para acceder a este reporte.");
      }
      throw new Error("Error al obtener el reporte de fumigaciones.");
    }
  }

  /**
   * Descargar reporte de fumigaciones en PDF
   * @param {Object} filters - Filtros opcionales
   */
  async downloadFumigationReportPDF(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.status) params.append("status", filters.status);
      if (filters.client_id) params.append("client_id", filters.client_id);

      const response = await axios.get(
        `fumigationRequest/reports/pdf/?${params.toString()}`,
        {
          headers: this.getHeaders(),
          responseType: "blob",
        }
      );

      const filename = this.generateFilename("reporte_fumigaciones", "pdf");
      this.downloadFile(response.data, filename, "application/pdf");

      return { success: true, filename };
    } catch (error) {
      console.error("Error downloading fumigation report PDF:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
      }
      if (error.response?.status === 403) {
        throw new Error("No tiene permisos para descargar este reporte.");
      }
      throw new Error("Error al descargar el reporte PDF de fumigaciones.");
    }
  }

  /**
   * Descargar reporte de fumigaciones en Excel
   * @param {Object} filters - Filtros opcionales
   */
  async downloadFumigationReportExcel(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.status) params.append("status", filters.status);
      if (filters.client_id) params.append("client_id", filters.client_id);

      const response = await axios.get(
        `fumigationRequest/reports/excel/?${params.toString()}`,
        {
          headers: this.getHeaders(),
          responseType: "blob",
        }
      );

      const filename = this.generateFilename("reporte_fumigaciones", "xlsx");
      this.downloadFile(
        response.data,
        filename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return { success: true, filename };
    } catch (error) {
      console.error("Error downloading fumigation report Excel:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
      }
      if (error.response?.status === 403) {
        throw new Error("No tiene permisos para descargar este reporte.");
      }
      throw new Error("Error al descargar el reporte Excel de fumigaciones.");
    }
  }

  // ===== REPORTES DE HISTORIAL DE CONSUMO =====

  /**
   * Obtener reporte de historial de consumo en JSON
   * @param {Object} filters - Filtros opcionales { start_date, end_date, product_id, fumigation_id, product_type }
   */
  async getConsumeHistoryReportJSON(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.product_id) params.append("product_id", filters.product_id);
      if (filters.fumigation_id)
        params.append("fumigation_id", filters.fumigation_id);
      if (filters.product_type)
        params.append("product_type", filters.product_type);

      const response = await axios.get(
        `history/reports/json/?${params.toString()}`,
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching consume history report JSON:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
      }
      if (error.response?.status === 403) {
        throw new Error("No tiene permisos para acceder a este reporte.");
      }
      throw new Error("Error al obtener el reporte de historial de consumo.");
    }
  }

  /**
   * Descargar reporte de historial de consumo en PDF
   * @param {Object} filters - Filtros opcionales
   */
  async downloadConsumeHistoryReportPDF(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.product_id) params.append("product_id", filters.product_id);
      if (filters.fumigation_id)
        params.append("fumigation_id", filters.fumigation_id);
      if (filters.product_type)
        params.append("product_type", filters.product_type);

      const response = await axios.get(
        `history/reports/pdf/?${params.toString()}`,
        {
          headers: this.getHeaders(),
          responseType: "blob",
        }
      );

      const filename = this.generateFilename("reporte_consumo", "pdf");
      this.downloadFile(response.data, filename, "application/pdf");

      return { success: true, filename };
    } catch (error) {
      console.error("Error downloading consume history report PDF:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
      }
      if (error.response?.status === 403) {
        throw new Error("No tiene permisos para descargar este reporte.");
      }
      throw new Error("Error al descargar el reporte PDF de historial de consumo.");
    }
  }

  /**
   * Descargar reporte de historial de consumo en Excel
   * @param {Object} filters - Filtros opcionales
   */
  async downloadConsumeHistoryReportExcel(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.product_id) params.append("product_id", filters.product_id);
      if (filters.fumigation_id)
        params.append("fumigation_id", filters.fumigation_id);
      if (filters.product_type)
        params.append("product_type", filters.product_type);

      const response = await axios.get(
        `history/reports/excel/?${params.toString()}`,
        {
          headers: this.getHeaders(),
          responseType: "blob",
        }
      );

      const filename = this.generateFilename("reporte_consumo", "xlsx");
      this.downloadFile(
        response.data,
        filename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return { success: true, filename };
    } catch (error) {
      console.error("Error downloading consume history report Excel:", error);
      if (error.response?.status === 401) {
        throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
      }
      if (error.response?.status === 403) {
        throw new Error("No tiene permisos para descargar este reporte.");
      }
      throw new Error("Error al descargar el reporte Excel de historial de consumo.");
    }
  }
}

export default new ReportService();