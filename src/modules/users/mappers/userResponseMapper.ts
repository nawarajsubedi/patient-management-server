import { User } from "@prisma/client";
import UserResponse from "../dto/userResponse.dto";
import LoginResponse from "../dto/loginResponse.dto";

export function mapUserToUserResponse(user: User): UserResponse {
  const { id, name, email } = user;
  return {
    id,
    name,
    email,
  } as UserResponse;
}

export function userLoginResponse(
  user: User,
  accessToken: string,
  refreshToken: string
): LoginResponse {
  const { id, name } = user;
  return {
    id,
    name,
    accessToken,
    refreshToken,
  } as LoginResponse;
}
