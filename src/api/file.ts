import { SERVER_API } from "../constant/constant";
import { apiClient, FileClient } from "./axios";

export const uploadImage = async (value: any) => {
  const customFileName = "123123213";
  const url = `${SERVER_API}upload-customize-photo?CustomFileName=${customFileName}`;

  return await FileClient.post<any>(url, value);
};

export const uploadFile = async (value: any) => {
  const url = `${SERVER_API}upload-file?CustomFileName=sdfa`;

  return await FileClient.post<any>(url, value);
};
