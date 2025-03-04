export const SERVER_API = "https://farm-forum.techtheworld.id.vn/";

export const categories = [
  { label: "Type1", value: 1, name: "Loại 1" },
  { label: "Type2", value: 2, name: "Loại 2" },
  { label: "Type3", value: 3, name: "Loại 3" },
];

export const statusOption = [
  { value: 1, name: "Đang hoạt động" },
  { value: 3, name: "Chờ duyệt" },
  { value: 4, name: "Đã xóa" },
];

export const postStatusOption = [
  { value: 1, name: "Chờ xét duyệt" },
  { value: 2, name: "Đã duyệt" },
  { value: 3, name: "Từ chối" },
];

export const genderOption = [
  { value: 1, name: "Nam" },
  { value: 2, name: "Nữ" },
  { value: 3, name: "Khác" },
];

export const prvYear = new Date(new Date().getFullYear() - 1, 0, 1);
export const nextYear = new Date(new Date().getFullYear() + 1, 0, 1);
export const maximumPrice = 9000000000000000;
