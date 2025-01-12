import moment from "moment";
import { SERVER_API } from "../constant/constant";
import { apiClient } from "./axios";

export const getBussinesPost = async (value: any) => {
  let payload = {
    pageIndex: 1,
    pageSize: 1000,
    keyword: "",
    orderDate: 1,
    totalRecord: 1,
    createdDate: {
      from: "2025-01-05",
      to: "2026-01-07",
    },
    totalPrice: {
      from: 1,
      to: 99999999999999,
    },
    status: null,
  };
  if (value) {
    payload = {
      pageIndex: 1,
      pageSize: 1000,
      keyword: value.searchTerm,
      orderDate: 1,
      totalRecord: 1,
      createdDate: {
        from: moment(value.fromDate).format("YYYY-MM-DD"),
        to: moment(value.toDate).format("YYYY-MM-DD"),
      },
      totalPrice: {
        from: value.minPrice,
        to: value.maxPrice,
      },
      status: value.status,
    };
  }

  return await apiClient.post<any>(`${SERVER_API}get-business-posts`, payload);
};

export const createFarmerPost = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}create-farmer-post`, value);
};

export const getFarmerPost = async (value: any) => {
  let payload = {
    pageIndex: 1,
    pageSize: 1000,
    keyword: "",
    orderDate: 1,
    totalRecord: 1,
    createdDate: {
      from: "2024-01-05",
      to: "2026-01-07",
    },
    totalPrice: {
      from: 1,
      to: 999999999999,
    },
    status: null,
  };
  if (value) {
    payload = {
      pageIndex: 1,
      pageSize: 1000,
      keyword: value.searchTerm,
      orderDate: 1,
      totalRecord: 1,
      createdDate: {
        from: moment(value.fromDate).format("YYYY-MM-DD"),
        to: moment(value.toDate).format("YYYY-MM-DD"),
      },
      totalPrice: {
        from: value.minPrice,
        to: value.maxPrice,
      },
      status: value.status,
    };
  }

  return await apiClient.post<any>(`${SERVER_API}get-farmer-posts`, payload);
};

export const createBussinesPost = async (value: any) => {
  return await apiClient.post<any>(`${SERVER_API}create-business-post`, value);
};

export const updatePostStatus = async (id: any, status: any) => {
  return await apiClient.put<any>(
    `${SERVER_API}update-post-status/${id}/${status}`
  );
};
