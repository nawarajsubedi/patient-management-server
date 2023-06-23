import {
  createUser,
  getUserByEmail,
} from "@/modules/users/repository/user.repository";
import { User } from "@prisma/client";
import { prismaMock } from "@tests/prismaTestSetup";

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

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createUser function", () => {
  const mockUserData = {
    id: "123",
    name: "John Doe",
    email: "john.doe@example.com",
    password: "password123",
  } as User;

  //@ts-ignore
  const mockCreate = prismaMock.user.create;

  test("it should return new user object with the correct arguments", async () => {
    mockCreate.mockResolvedValue(mockUserData);
    const user = await createUser(mockUserData);
    expect(mockCreate).toHaveBeenCalledWith({ data: mockUserData });
    expect(user).toEqual(mockUserData);
  });

  test("it should throw an error if user creation fails", async () => {
    mockCreate.mockRejectedValue(new Error("Failed to create a user"));
    expect(createUser(mockUserData)).rejects.toThrowError(
      "Failed to create a user"
    );
  });
});

describe("getExistingUser function", () => {
  const mockFindUnique = prismaMock.user.findUnique;

  test("it should return the existing user data with the given email", async () => {
    const mockUserData = {
      id: "123",
      name: "John Doe",
      email: "john.doe@example.com",
    } as User;
    mockFindUnique.mockResolvedValue(mockUserData);
    const user = await getUserByEmail(mockUserData.email);
    expect(user).toEqual(mockUserData);
  });

  test("it should return null if user with given email is not found", async () => {
    const email = "test@gmail.com";
    mockFindUnique.mockResolvedValue(null);
    const user = await getUserByEmail(email);
    expect(user).toBeNull();
  });

  test("it should throw an error if fetching user fails", async () => {
    const email = "test@gmail.com";
    mockFindUnique.mockRejectedValue(new Error("User could not be fetched"));

    expect(getUserByEmail(email)).rejects.toThrowError(
      "User could not be fetched"
    );
  });
});
