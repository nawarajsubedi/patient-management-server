import { userSignup, userSignin } from "@modules/users/services/user.service";
import * as UserRepositiory from "@modules/users/repository/user.repository";
import { AppError } from "@common/exceptions/appError";
import * as Mappers from "@modules/users/mappers/userResponseMapper";
import sinon from "sinon";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUsers } from "@/modules/users/services/user.service";
import { User } from "@prisma/client";

afterEach(() => {
  sinon.restore();
});

const mockUserData: User = {
  id: "123",
  name: "John Doe",
  email: "john.doe@example.com",
} as User;

describe("userSignup", () => {
  const email = "john.doe@example.com";
  const password = "testPassword";
  const hashedPassword = "hashedPassword";

  const payload = {
    ...mockUserData,
  } as User;

  test("it should throw an error if user already exists", async () => {
    const existingUserFun = sinon
      .stub(UserRepositiory, "getUserByEmail")
      .resolves(payload);
    expect(userSignup(payload)).rejects.toThrowError(AppError);

    sinon.assert.calledOnceWithExactly(existingUserFun, email);
  });

  test("it should return new created user with hashedPassword", async () => {
    sinon.stub(UserRepositiory, "getUserByEmail").resolves(null);

    sinon.stub(bcrypt, "hash").resolves(hashedPassword);
    sinon.stub(UserRepositiory, "createUser").resolves(payload);

    const bcryptHashPassword = await bcrypt.hash(password, 10);
    const result = await userSignup(payload);
    expect(result).toEqual(payload);
    expect(bcryptHashPassword).toEqual(hashedPassword);
  });

  test("it should throw error if creating user fails", async () => {
    sinon.stub(UserRepositiory, "getUserByEmail").resolves(null);
    sinon.stub(bcrypt, "hash").resolves(hashedPassword);
    sinon.stub(UserRepositiory, "createUser").resolves(null);

    expect(userSignup(payload)).rejects.toThrowError(AppError);
  });

  test('it should not have "password" field in the returned data', async () => {
    sinon.stub(UserRepositiory, "getUserByEmail").resolves(null);
    sinon.stub(bcrypt, "hash").resolves(hashedPassword);
    sinon.stub(UserRepositiory, "createUser").resolves(payload);
    const result = await userSignup(payload);
    expect(result).toEqual(
      expect.not.objectContaining({ password: expect.anything() })
    );
  });
});

describe("userSignin", () => {
  const email = "test@example.com";
  const password = "testPassword";
  const payload = {
    ...mockUserData,
    password,
  } as User;

  test("it should throw an error if user with given email does not exist", async () => {
    sinon.stub(UserRepositiory, "getUserByEmail").resolves(null);
    expect(userSignin(payload)).rejects.toThrowError(AppError);
  });

  test("it should throw error if password and email does not match", async () => {
    sinon.stub(UserRepositiory, "getUserByEmail").resolves(payload);
    sinon.stub(bcrypt, "compare").resolves(false);
    expect(userSignin(payload)).rejects.toThrowError(AppError);
  });

  test("it should generate accessToken and refreshToken", async () => {
    const accessToken = "accessToken";
    const refreshToken = "refreshToken";

    sinon.stub(UserRepositiory, "getUserByEmail").resolves(payload);
    sinon.stub(bcrypt, "compare").resolves(true);
    sinon
      .stub(jwt, "sign")
      .onFirstCall()
      .callsFake(() => accessToken)
      .onSecondCall()
      .callsFake(() => refreshToken);
    const result = await userSignin(payload);
    const expectedResult = {
      accessToken,
      refreshToken,
      id: payload.id,
      name: payload.name,
    };
    expect(result).toEqual(expectedResult);
  });

  test("it should return object containing id, name and tokens", async () => {
    const accessToken = "accessToken";
    const refreshToken = "refreshToken";

    sinon.stub(UserRepositiory, "getUserByEmail").resolves(payload);
    sinon.stub(bcrypt, "compare").resolves(true);
    sinon
      .stub(jwt, "sign")
      .onFirstCall()
      .callsFake(() => accessToken)
      .onSecondCall()
      .callsFake(() => refreshToken);
    const result = await userSignin(payload);
    const expectedResult = {
      accessToken,
      refreshToken,
      id: payload.id,
      name: payload.name,
    };
    expect(result).toEqual(expectedResult);
  });
});
