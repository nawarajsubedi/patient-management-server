import { Result } from "@common/core/Result";
import {
  signup,
  signin,
  getUser,
} from "@modules/users/controllers/user.controller";
import { HttpCode } from "@common/exceptions/appError";
import { Request, Response } from "express";
import {
  userSignup,
  userSignin,
  getUsers,
} from "@modules/users/services/user.service";
import LoginResponse from "@/modules/users/dto/loginResponse.dto";

jest.mock("@modules/users/services/user.service");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("signup controller", () => {
  const mockReq: Partial<Request> = {
    body: {
      email: "test@example.com",
      password: "password123",
    },
  };

  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockUserData = {
    id: "123",
    name: "John Doe",
    email: "john.doe@example.com",
  };

  test("should call userSignup with the correct arguments", async () => {
    (userSignup as jest.Mock).mockResolvedValue(mockUserData);

    await signup(mockReq as Request, mockRes as Response);

    expect(userSignup).toHaveBeenCalledWith(mockReq.body);
  });

  test("should return the correct response with status 201", async () => {
    (userSignup as jest.Mock).mockResolvedValue(mockUserData);

    await signup(mockReq as Request, mockRes as Response);
    expect(userSignup).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.CREATED);
    expect(mockRes.json).toHaveBeenCalledWith(Result.ok(mockUserData));
  });
});

describe("signin controller", () => {
  const mockReq: Partial<Request> = {
    body: {
      email: "test@example.com",
      password: "password123",
    },
  };

  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockUserData = {
    id: "123",
    name: "John Doe",
    accessToken: "john.doe@example.com",
    refreshToken: "john.doe@example.com",
  } as LoginResponse;

  test("should call userSignin with the correct arguments", async () => {
    (userSignin as jest.Mock).mockResolvedValue(mockUserData);
    await signin(mockReq as Request, mockRes as Response);
    expect(userSignin).toHaveBeenCalledWith(mockReq.body);
  });

  test("should return the correct response with status 200", async () => {
    (userSignin as jest.Mock).mockResolvedValue(mockUserData);
    await signin(mockReq as Request, mockRes as Response);
    expect(userSignin).toHaveBeenCalledWith(mockReq.body);
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.OK);
    expect(mockRes.json).toHaveBeenCalledWith(Result.ok(mockUserData));
  });
});

describe("getUsers controller", () => {
  const mockReq: Partial<Request> = {};
  const mockRes: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

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
  ];

  test("should call getUsers with the correct arguments", async () => {
    (getUsers as jest.Mock).mockResolvedValue(mockUserData);
    await getUser(mockReq as Request, mockRes as Response);
    expect(getUsers).toHaveBeenCalled();
  });

  test("should return the correct response with status 200", async () => {
    (getUsers as jest.Mock).mockResolvedValue(mockUserData);
    await getUser(mockReq as Request, mockRes as Response);
    expect(mockRes.status).toHaveBeenCalledWith(HttpCode.OK);
    expect(mockRes.json).toHaveBeenCalledWith(Result.ok(mockUserData));
  });
});
