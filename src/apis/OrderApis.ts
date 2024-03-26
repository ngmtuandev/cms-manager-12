import axiosClient from "../libs/axios-client";

export type updateStatusRequest = {
  orderId: string,
  status: string
}

const getOrders = async () => {
  try {
    const response = await axiosClient.get("/admin/orders");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};




const updateStatusAdmin = async (data:updateStatusRequest) => {
  try {
    const response = await axiosClient.put("/admin/orders", {
      order: data
    });
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export {  getOrders, updateStatusAdmin};