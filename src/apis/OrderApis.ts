import axiosClient from "../libs/axios-client";

export type updateStatusRequest = {
  orderId: string;
  status: string;
  total?: number;
};

const getOrders = async () => {
  try {
    const response = await axiosClient.get("/admin/orders");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getOrdersDesign = async () => {
  try {
    const response = await axiosClient.get("/admin/orders/design");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const updateStatusAdmin = async (data: updateStatusRequest) => {
  try {
    const response = await axiosClient.put("/admin/orders", {
      order: data,
    });
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const updateStatusDesignAdmin = async (data: updateStatusRequest) => {
  try {
    const response = await axiosClient.put("/admin/orders/design", {
      order: data,
    });
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export {
  getOrders,
  updateStatusAdmin,
  getOrdersDesign,
  updateStatusDesignAdmin,
};
