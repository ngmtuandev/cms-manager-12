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

const getStatisticalOrder = async () => {
  try {
    const response = await axiosClient.get("/statistical/orders");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrderSelling = async () => {
  try {
    const response = await axiosClient.get("/statistical/orders/selling");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrderDesign = async () => {
  try {
    const response = await axiosClient.get("/statistical/orders-design");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getStatisticalOrderDesignSelling = async () => {
  try {
    const response = await axiosClient.get(
      "/statistical/orders-design/selling"
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
  getStatisticalOrderDesignSelling
};
