import axios from "axios";
import { SERVER_API } from "../constant/constant";
import { RegisterUserDto } from "../dto/RegisterDto";
import { UserLoginData } from "../dto/LoginDto";

export const register = async (value: RegisterUserDto) => {
  return await axios.post<any>(`${SERVER_API}sign-up-account`, value);
};

export const login = async (value: UserLoginData) => {
  console.log("VALUE: ", value);
  return await axios.post<any>(`${SERVER_API}login`, value);
};
