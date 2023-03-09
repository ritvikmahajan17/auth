const { HTTPError } = require("../error/error");
const services = require("../services/auth.services");
const authController = require("./auth.controller");

describe("userController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new user successfully", async () => {
   
        const req = { body: { email: "testuser", password: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        
        jest.spyOn(services,"saveUserDetailsService").mockResolvedValueOnce({ id: 1, email: "testuser" });

        await authController.userController(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: 1, email: "testuser" });
    });

    it("should handle errors", async () => {

        const req = { body: { email: "testuser", password: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        services.saveUserDetailsService.mockRejectedValueOnce(new Error("Database error"));


        await authController.userController(req, res);

        
        expect(services.saveUserDetailsService).toHaveBeenCalledTimes(1);
        expect(services.saveUserDetailsService).toHaveBeenCalledWith("testuser", "password123");

       
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
});

describe("loginController", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
  
    it("should return a token for valid credentials", async () => {
       
        const req = { body: { email: "testuser", password: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        
        jest.spyOn(services, "loginService").mockResolvedValueOnce("testtoken");
  
        
        await authController.loginController(req, res);
  
       
        expect(services.loginService).toHaveBeenCalledTimes(1);
        expect(services.loginService).toHaveBeenCalledWith("testuser", "password123");
  
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith("testtoken");
    });
    it("should handle HTTP errors", async () => {
       
        const req = { body: { email: "testuser", password: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
        
        const httpError = new HTTPError("Invalid credentials",401);
        jest.spyOn(services, "loginService").mockRejectedValueOnce(httpError);
    
       
        await authController.loginController(req, res);
    
        
        expect(services.loginService).toHaveBeenCalledTimes(1);
        expect(services.loginService).toHaveBeenCalledWith("testuser", "password123");
    
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });
    
    it("should handle other errors", async () => {
        
        const req = { body: { email: "testuser", password: "password123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
       
        const error = new Error("Database error");
        jest.spyOn(services, "loginService").mockRejectedValueOnce(error);
    
        
        await authController.loginController(req, res);
    
       
        expect(services.loginService).toHaveBeenCalledTimes(1);
        expect(services.loginService).toHaveBeenCalledWith("testuser", "password123");
    
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });

});

describe("validateController", () => {
    let validateTokenServiceSpy;

    beforeEach(() => {
        validateTokenServiceSpy = jest.spyOn(services, "validateTokenService");
    });

    afterEach(() => {
   
        validateTokenServiceSpy.mockRestore();
    });

    it("should return a success message and email for a valid token", async () => {
   
        const req = { headers: { authorization: "validtoken" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

       
        validateTokenServiceSpy.mockResolvedValueOnce({ email: "testuser" });

       
        await authController.validateController(req, res);

       
        expect(validateTokenServiceSpy).toHaveBeenCalledTimes(1);
        expect(validateTokenServiceSpy).toHaveBeenCalledWith("validtoken");

       
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Valid Token", email: "testuser" });
    });

    it("should handle errors", async () => {
   
        const req = { headers: { authorization: "invalidtoken" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        
        const error = new Error("Database error");
        validateTokenServiceSpy.mockRejectedValueOnce(error);

        
        await authController.validateController(req, res);

       
        expect(validateTokenServiceSpy).toHaveBeenCalledTimes(1);
        expect(validateTokenServiceSpy).toHaveBeenCalledWith("invalidtoken");

       
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
});


