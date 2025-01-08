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

export const downloadFile = async (value: string) => {
  try {
    // Yêu cầu tải tệp từ API
    const response = await apiClient.get(
      `${SERVER_API}download-file/${encodeURIComponent(value)}`,
      {
        responseType: "blob", // Đảm bảo nhận dữ liệu dạng Blob
      }
    );

    // Tạo URL từ Blob
    const fileUrl = window.URL.createObjectURL(response.data);

    // Tạo thẻ a để tải tệp
    const a = document.createElement("a");
    a.href = fileUrl;

    // Lấy tên tệp từ Header hoặc dùng tên mặc định
    const fileName =
      response.headers["content-disposition"]
        ?.split("filename=")[1]
        ?.replace(/"/g, "") || "downloaded_file.docx";

    a.download = fileName;

    // Thực hiện tải tệp
    a.click();

    // Xóa URL sau khi tải
    window.URL.revokeObjectURL(fileUrl);
  } catch (error) {
    console.error("Error downloading file:", error);
    alert("Không thể tải xuống tệp. Vui lòng kiểm tra lại.");
  }
};
