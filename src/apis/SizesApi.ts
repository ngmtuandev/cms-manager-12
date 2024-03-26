import axiosClient from "../libs/axios-client";

const getSizes = async () => {
  try {
    const response = await axiosClient.get("/receipt/sizes");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

 
export {  getSizes };