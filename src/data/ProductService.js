import axios from "axios";
import { useAppStore } from "../stores/index";

async function getProductTypes() {
  try {
    const appStore = useAppStore();
    const token = appStore.token
      ? typeof appStore.token === "object" && appStore.token.access
        ? appStore.token.access
        : appStore.token
      : null;
    if (!token) {
      throw new Error("No authentication token found.");
    }
    const response = await axios.get("productType/list/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product types:", error);
    throw error;
  }
}

async function getProducts() {
  try {
    const appStore = useAppStore();
    const token = appStore.token
      ? typeof appStore.token === "object" && appStore.token.access
        ? appStore.token.access
        : appStore.token
      : null;
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get("product/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export default {
  getProductTypes,
  getProducts,
};
