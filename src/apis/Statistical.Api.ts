import axiosClient from "../libs/axios-client";

const getAllStatistical = async () => {
  try {
    const response = await axiosClient.get("/statistical");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getTopSelling = async () => {
  try {
    const response = await axiosClient.get("/statistical/topSelling");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getOutOfStock = async () => {
  try {
    const response = await axiosClient.get("/statistical/outOfStock");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrder = async (params?: any) => {
  try {
    const response = await axiosClient.get("/statistical/orders", { params });
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrderSelling = async (params?: any) => {
  try {
    const response = await axiosClient.get("/statistical/orders/selling", {
      params,
    });
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrderDesign = async (params?: any) => {
  try {
    const response = await axiosClient.get("/statistical/orders-design", {
      params,
    });
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrderDesignSelling = async (params?: any) => {
  try {
    const response = await axiosClient.get(
      "/statistical/orders-design/selling",
      { params }
    );
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export {
  getAllStatistical,
  getStatisticalOrder,
  getStatisticalOrderDesign,
  getStatisticalOrderSelling,
  getTopSelling,
  getOutOfStock,
  getStatisticalOrderDesignSelling,
};
