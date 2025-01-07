export interface RegisterUserDto {
  phoneNumber: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  userType: number;
}
