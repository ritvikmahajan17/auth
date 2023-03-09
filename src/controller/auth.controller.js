const { HTTPError } = require("../error/error");
const services = require("../services/auth.services");

const userController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        const userDetails = await services.saveUserDetailsService(email, password);
        res.status(201).json(userDetails);
    }
    catch(error){
        res.status(500).json({"error":error.message});
    }
};

const loginController = async (req,res)=> {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        const token = await services.loginService(email,password);
        res.status(200).json(token);
    }
    catch(error){
        if(error instanceof HTTPError){
            // console.log("instance of", error.code, error.message);
            // console.log(error.message,"error");
            res.status(200).json({"error":error.message});
        }
        else{
            // console.log( Object.keys(error),"error");
            res.status(500).json({message:error.message});
        }
    }
};

const validateController = async (req,res) => {
    // console.log("validate");
    try {
        const token = req.headers.authorization;
        const isValid = await services.validateTokenService(token);
        res.status(200).json({
            "message":"Valid Token",
            "email": isValid.email
        });
    }
    catch(error){
        res.status(500).json({"error":error.message});
    }
};

// const getUsers = async (req,res) => {
//     try {
//         const users = await services.getUsersService();
//         res.status(200).json(users);
//     }
//     catch(error){
//         res.status(500).json({"error":error.message});
//     }
// };

module.exports = {
    userController,
    loginController,
    validateController,
    // getUsers
};