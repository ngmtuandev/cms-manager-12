import axiosClient from "../libs/axios-client";

const getCategories = async () => {
  try {
    const response = await axiosClient.get("/receipt/categories");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

 
export {  getCategories };