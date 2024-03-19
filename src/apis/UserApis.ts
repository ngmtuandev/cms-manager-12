import axiosClient from "../libs/axios-client";
import { SigUpReq, SignRes } from "../types/TAuth";

const signIn = async (data: SignRes) => {
  try {
    const response = await axiosClient.post("/auth/local/signin", data);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const logout = async () => {
  try {
    const response = await axiosClient.post("/auth/logout");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getUsers = async () => {
  try {
    const response = await axiosClient.get("/users");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

export { signIn, logout, getUsers};
