import axios from "axios";

async function getProductTypes() {
  try {
    const response = await axios.get("productType/list/");
    return response.data;
  } catch (error) {
    console.error("Error fetching product types:", error);
    throw error;
  }
}

async function getProducts() {
  try {
    const response = await axios.get("product/");
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
