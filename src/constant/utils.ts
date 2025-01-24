export const saveToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

export const decodeJwt = (token: string | null) => {
  const parts = token?.split(".");
  if (parts?.length === 3) {
    return JSON.parse(atob(parts[1]));
  } else {
    console.log("Invalid token format");
  }
};

export const role = () => {
  const user = decodeJwt(getFromLocalStorage("token"));
  if (user?.is_admin === "True") {
    return 1;
  }
  if (user?.is_farmer === "True") {
    return 2;
  }
  if (user?.is_business === "True") {
    return 3;
  }
};

export const getStatus = (value: any) => {
  if (value === "Pending" || value === "1") {
    return "Đang chờ duyệt";
  } else if (value === "Approved" || value === "2") {
    return "Đã duyệt";
  } else {
    return "Từ chối";
  }
};

export const getURL = (value: any) => {
  return `/src/assets${value}.svg`;
};

export const translateRole = (role: string): string => {
  if (role === "Admin") {
    return "Quản trị viên";
  } else if (role === "Farmer") {
    return "Nông dân";
  } else if (role === "Business") {
    return "Doanh nghiệp";
  } else {
    return "Vai trò không xác định";
  }
};

export const translateStatus = (status: string): string => {
  switch (status) {
    case "None":
      return "Không xác định";
    case "Online":
      return "Đang hoạt động";
    case "Offline":
      return "Ngưng hoạt động";
    case "Pending":
      return "Đang chờ duyệt";
    case "Deleted":
      return "Đã xóa";
    default:
      return "Trạng thái không hợp lệ"; // Nếu có trạng thái không hợp lệ
  }
};
