const express = require("express");
const authRouter = express();
const controller = require("../controller/auth.controller");

authRouter.use(express.json());

authRouter.post("/user",controller.userController);
authRouter.post("/login",controller.loginController);
authRouter.get("/token/validate",controller.validateController);
// authRouter.get("/allUsers",controller.getUsers);




module.exports = authRouter;