import axiosClient from "../libs/axios-client";
import {  SignRes } from "../types/TAuth";

const signIn = async (data: SignRes) => {
  try {
    const response = await axiosClient.post("/auth/local/admin/signin", data);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const getProfile = async () => {
  try {
    const response = await axiosClient.get("/users/profile");
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const addUser = async (data: any) => {
  try {
    const response = await axiosClient.post("/auth/local/admin/signup", data);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const deleteUser = async (id: string) => {
  try {
    const response = await axiosClient.delete(`/users/${id}`);
    return response; // Return data if needed
  } catch (error) {
    throw error; // Rethrow error or handle it accordingly
  }
};

const updateUser = async (id: string, data:any) => {
  try {
    const response = await axiosClient.put(`/users/${id}`,data);
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

export { signIn, logout, getUsers, addUser, deleteUser, updateUser, getProfile};
  