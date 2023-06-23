// import sinon from 'sinon';
import * as Mappers from "@modules/users/mappers/userResponseMapper";
import { User } from "@prisma/client";

const mockUserData = [
  {
    id: "123",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: "345",
    name: "Xavier Cal",
    email: "xavier.cal@example.com",
  },
] as User[];

describe("mapUserToUserResponse", () => {
  test("it should map a user to a user response", () => {
    const mockUserData = {
      id: "123",
      name: "John Doe",
      email: "john.doe@example.com",
    } as User;
    const userResponse = Mappers.mapUserToUserResponse(mockUserData);
    expect(userResponse).toEqual({
      id: "123",
      name: "John Doe",
      email: "john.doe@example.com",
    });
  });
});

describe("userLoginResponse", () => {
  test("it should return a LoginResponse object with the correct properties", () => {
    const mockUserData = {
      id: "123",
      name: "John Doe",
      email: "john.doe@example.com",
    } as User;

    const accessToken = "token";
    const refreshToken = "refresh";

    const loginResponse = Mappers.userLoginResponse(
      mockUserData,
      accessToken,
      refreshToken
    );
    expect(loginResponse.accessToken).toBe(accessToken);
    expect(loginResponse.refreshToken).toBe(refreshToken);
    expect(loginResponse.id).toBe(mockUserData.id);
    expect(loginResponse.name).toBe(mockUserData.name);
  });
});
