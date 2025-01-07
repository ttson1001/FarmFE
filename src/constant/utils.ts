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
  if (user.is_admin === "True") {
    return 1;
  }
  if (user.is_farmer === "True") {
    return 2;
  }
  if (user.is_business === "True") {
    return 3;
  }
};
