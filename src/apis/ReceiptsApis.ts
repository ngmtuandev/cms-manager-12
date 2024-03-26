import axiosClient from "../libs/axios-client";

const getReceipts = async () => {
  try {
    const response = await axiosClient.get("/receipt");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const createReceipts = async (data:any) => {
  try {
    const response = await axiosClient.post("/receipt", data);
    return response;
  } catch (error) {
    console.log(error)
  }
}




export {  getReceipts, createReceipts};