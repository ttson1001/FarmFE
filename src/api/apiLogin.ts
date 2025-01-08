import axios from "axios";
import { SERVER_API } from "../constant/constant";
import { RegisterUserDto } from "../dto/RegisterDto";
import { UserLoginData } from "../dto/LoginDto";
import { apiClient } from "./axios";

export const register = async (value: RegisterUserDto) => {
  return await axios.post<any>(`${SERVER_API}sign-up-account`, value);
};

export const login = async (value: UserLoginData) => {
  return await axios.post<any>(`${SERVER_API}login`, value);
};

export const getAccounts = async (value: any) => {
  if (!value) {
    value = {
      pageIndex: 1,
      pageSize: 1000,
      keyword: "",
      orderDate: 0,
      totalRecord: 0,
      status: 1,
      createdDate: {
        from: "2024-01-07",
        to: "2025-01-07",
      },
    };
  }
  return await apiClient.post<any>(`${SERVER_API}get-accounts`, value);
};

export const forgotPassword = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}forgot-password`, value);
};

export const ressetPassword = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}reset-password`, value);
};

export const changePassword = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}change-password`, value);
};

export const approvedAccount = async (value: any) => {
  return await apiClient.put<any>(`${SERVER_API}approve-account/${value}`);
};

export const deleteAccount = async (value: any) => {
  return await apiClient.delete<any>(`${SERVER_API}delete-accounts/${value}`);
};
