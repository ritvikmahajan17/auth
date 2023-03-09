const {authentication} = require("../../database/models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const utils = require("../utils/auth.utils");
const redisFunctions = require("../utils/redis.utils");
const { HTTPError } = require("../error/error");


const saveUserDetailsService = async (email,password) => {
    let hashedPass="";
    await bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(password, salt);
        })
        .then(hash => {
            hashedPass=hash;
        })
        .catch(err => console.error(err.message));
    // console.log(email,hashedPass);
    const user = await authentication.create({
        email:email,
        password:hashedPass
    });

    console.log(user);

    return user;
};

const loginService = async (email,password) => {
    console.log(email,password);
    const user = await authentication.findOne({
        where:{
            email:email,
        }
    });

    console.log(user);

    if(!user){
        throw new Error({"message":"email not found"});
    }

    const isValid = await bcrypt.compare(password,user.password);
    // console.log(isValid);
    if(!isValid) {
        // console.log("invalid");
        throw new HTTPError("Incorrect Password",500);
    }
    // console.log("valid");
    const accessToken = utils.getAccesToken({
        email:email,
    });
    // console.log(accessToken);

    redisFunctions.storeToken(accessToken,user.email);

    return {accessToken:accessToken}; 
};


const validateTokenService = async (token) => {
    const decoded = utils.validateToken(token);
    // console.log(decoded.email);
    const tokenFromRedis = await redisFunctions.getToken(token);
    // console.log(tokenFromRedis,token);
    if (!tokenFromRedis) throw new Error("Invalid token");
    return decoded;
};

// const getUsersService = async () => {
//     const users = await authentication.findAll();
//     return users;
// };




module.exports = {
    saveUserDetailsService,
    loginService,
    validateTokenService,
    // getUsersService
};