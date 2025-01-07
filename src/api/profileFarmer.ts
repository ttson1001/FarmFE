import { SERVER_API } from "../constant/constant";
import { FarmerProfileDto } from "../dto/FarmerProfileDto";
import { apiClient } from "./axios";

export const getProfile = async () => {
  return await apiClient.get<any>(`${SERVER_API}get-personal-farmer-profile`);
};

export const updatePròile = async (value: FarmerProfileDto) => {
  console.log(value);
  return await apiClient.post<any>(
    `${SERVER_API}create-update-personal-farmer-profile`,
    value
  );
};
