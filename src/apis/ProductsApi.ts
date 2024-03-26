import axiosClient from "../libs/axios-client";

const getProducts = async () => {
  try {
    const response = await axiosClient.get("/products/admin");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const createDiscount = async (data: any) => {
  try {
    const response = await axiosClient.post("/discount", data);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const updateDiscount = async (data: any, id:number) => {
  try {
    const response = await axiosClient.put(`/discount/${id}`, data);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const deleteDiscount = async (id:string) => {
  try {
    const response = await axiosClient.delete(`/discount/${id}`);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export { getProducts };
