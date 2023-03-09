const {authentication} = require("../../database/models");
const authServices = require("../services/auth.services");
const bcrypt = require("bcrypt");
const utils = require("../utils/auth.utils");
const redisFunctions = require("../utils/redis.utils");

describe("user creating in database", () => {
    it("should create a user in db when details provided", async () => {
        jest.spyOn(authentication, "create").mockResolvedValue({ email: "test", password: "test" });
        const user = await authServices.saveUserDetailsService({ email: "test", password: "test" });
        expect(user).toEqual({ email: "test", password: "test" });
    });
});

describe("login user", () => {
    it("should login a user when correct details are provided", async () => {
        jest.spyOn(authentication, "findOne").mockResolvedValue({ email: "test", password: "test" });
        jest.spyOn(bcrypt, "compare").mockReturnValue(true);
        jest.spyOn(utils, "getAccesToken").mockReturnValue("token");
        jest.spyOn(redisFunctions, "storeToken").mockResolvedValue("token");
        const response = await authServices.loginService({ email: "test", password: "test" });
        expect(response).toEqual({"accessToken": "token"});
    });
    it("should throw an error when user not found in db", async () => {
        const err = new Error({"message":"email not found"});
        jest.spyOn(authentication, "findOne").mockResolvedValue(null);
        await expect(authServices.loginService({ email: "test", password: "test" })).rejects.toThrow(err);
    });
    it("should throw error when user password is incorrect", async () => {
        const err = new Error("Incorrect Password");
        jest.spyOn(authentication, "findOne").mockResolvedValue({ email: "tuser" });
        jest.spyOn(bcrypt, "compare").mockResolvedValue(false);
        await expect(authServices.loginService({ email: "tuser", password: "test" })).rejects.toThrow(err);
    });
});

describe("verify token", () => {
    it("should verift token if correct", async () => {
        jest.spyOn(redisFunctions, "getToken").mockResolvedValue("token");
        jest.spyOn(utils, "validateToken").mockReturnValue({ email: "test" });
        const response = await authServices.validateTokenService("token");
        expect(response).toEqual({ email: "test" });
    });
    // it("should throw error if token is invalid", async () => {
    //     const err = new Error("Invalid token");
    //     jest.spyOn(redisFunctions, "getToken").mockResolvedValue("token");
    //     jest.spyOn(utils, "validateToken").mockReturnValue(null);
    //     await expect(authServices.validateTokenService("token")).rejects.toThrow(err);
    // });
    // it("should throw error if token is not the same as redis token", async () => {
    //     const err = new Error("Invalid token");
    //     jest.spyOn(redisFunctions, "validateToken").mockResolvedValue("token");
    //     await expect(authServices.validateTokenService("token1")).rejects.toThrow(err);
    // });
});

