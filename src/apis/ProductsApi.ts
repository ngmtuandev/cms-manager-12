import axiosClient from "../libs/axios-client";

const getProducts = async () => {
  try {
    const response = await axiosClient.get("/products/admin");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const updateProduct = async (id:number, data:any) => {
  try {
    const response = await axiosClient.put(`/products/${id}/admin`,data);
    return response; // Return data if needed,
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const deleteProduct = async (id:number) => {
  try {
    const response = await axiosClient.delete(`/products/${id}/admin`);
    return response; // Return data if needed,
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export { getProducts, updateProduct,deleteProduct};
