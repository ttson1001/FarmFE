import { maximumPrice, SERVER_API } from "../constant/constant";
import { apiClient } from "./axios";

export const getFarmerHistory = async () => {
  const payload = {
    pageIndex: 1,
    pageSize: 1000,
    keyword: "",
    orderDate: 1,
    totalRecord: 1,
    createdDate: {
      from: "2024-01-29",
      to: "2026-12-30",
    },
    totalPrice: {
      from: 0,
      to: maximumPrice,
    },
    unitPrice: {
      from: 0,
      to: maximumPrice,
    },
    status: null,
  };

  return await apiClient.post<any>(
    `${SERVER_API}get-personal-farmer-posts`,
    payload
  );
};

export const deletePost = async (id: number) => {
  return await apiClient.delete<any>(`${SERVER_API}delete-post/${id}`);
};

export const getBusinessHistory = async () => {
  const payload = {
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
    orderDate: 1,
    totalRecord: 1,
    createdDate: {
      from: "2024-01-29",
      to: "2025-12-30",
    },
    totalPrice: {
      from: 1,
      to: Number.MIN_SAFE_INTEGER,
    },
    unitPrice: {
      from: 0,
      to: maximumPrice,
    },
    status: null,
  };

  return await apiClient.post<any>(
    `${SERVER_API}get-personal-business-posts`,
    payload
  );
};

export const UpdateFarmerPost = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}update-farmer-post`, value);
};

export const UpdateBusinessPost = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}update-business-post`, value);
};

export const addImageToPost = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}add-images-to-post`, value);
};

export const delImageFromPost = async (postId: number, imageIds: number[]) => {
  try {
    const response = await apiClient.delete<any>(
      `${SERVER_API}delete-images-from-post`,
      {
        data: {
          postId,
          imageIds,
        },
      }
    );
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error("Error deleting image from post:", error);
  }
};

export const delFileFromPost = async (postId: number, fileIds: number[]) => {
  try {
    const response = await apiClient.delete<any>(
      `${SERVER_API}delete-files-from-post`,
      {
        data: {
          postId,
          fileIds,
        },
      }
    );
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error("Error deleting image from post:", error);
  }
};

export const addFileToPost = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}add-files-to-post`, value);
};
