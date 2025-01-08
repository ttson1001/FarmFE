import { SERVER_API } from "../constant/constant";
import { FarmerProfileDto } from "../dto/FarmerProfileDto";
import { apiClient } from "./axios";

export const getProfile = async () => {
  return await apiClient.get<any>(`${SERVER_API}get-personal-farmer-profile`);
};

export const getBusinesProfile = async () => {
  return await apiClient.get<any>(`${SERVER_API}get-personal-business-profile`);
};

export const updateProfile = async (value: FarmerProfileDto) => {
  return await apiClient.post<any>(
    `${SERVER_API}create-update-personal-farmer-profile`,
    value
  );
};

export const updateBusinessProfile = async (value: any) => {
  return await apiClient.post<any>(
    `${SERVER_API}create-update-personal-business-profile`,
    value
  );
};
