import axiosClient from "../libs/axios-client";

const getShops = async () => {
  try {
    const response = await axiosClient.get("/receipt/shops");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

 
export {  getShops };