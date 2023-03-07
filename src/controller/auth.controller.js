const services = require("../services/auth.services");

const userController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userDetails = await services.saveUserDetailsService(username, password);
        res.status(201).json(userDetails);
    }
    catch(error){
        res.status(500).json({"error":error.message});
    }
};

const loginController = async (req,res)=> {
    try {
        const { username, password } = req.body;
        const token = await services.loginService(username,password);
        res.status(200).json(token);
    }
    catch(error){
        res.status(500).json({"error":error.message});
    }
};

const validateController = async (req,res) => {
    console.log("validate");
    try {
        const token = req.headers.authorization;
        const isValid = await services.validateTokenService(token);
        res.status(200).json({
            "message":"Valid Token",
            "username": isValid.username
        });
    }
    catch(error){
        res.status(500).json({"error":error.message});
    }
};

module.exports = {
    userController,
    loginController,
    validateController,
};