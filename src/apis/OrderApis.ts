import axiosClient from "../libs/axios-client";

const getOrders = async () => {
  try {
    const response = await axiosClient.get("/admin/orders");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export {  getOrders };