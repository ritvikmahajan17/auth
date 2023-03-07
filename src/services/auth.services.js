const {authentication} = require("../../database/models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const utils = require("../utils/auth.utils");
const redisFunctions = require("../utils/redis.utils");


const saveUserDetailsService = async (username,password) => {
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
    
    const user = await authentication.create({
        username:username,
        password:hashedPass
    });

    return user;
};

const loginService = async (username,password) => {

    const user = await authentication.findOne({
        where:{
            username:username,
        }
    });

    if(!user){
        throw new Error({"message":"Username not found"});
    }

    const isValid = await bcrypt.compare(password,user.password);

    if(!isValid) throw new Error({"message":"Incorrect Password"});
    
    const accessToken = utils.getAccesToken({
        username:username,
    });

    redisFunctions.storeToken(accessToken,user.username);

    return {accessToken:accessToken}; 
};


const validateTokenService = async (token) => {
    const decoded = utils.validateToken(token);
    console.log(decoded.username);
    const tokenFromRedis = await redisFunctions.getToken(decoded.username);
    console.log(tokenFromRedis,token);
    if (tokenFromRedis !== token) throw new Error("Invalid token");
    return decoded;
};




module.exports = {
    saveUserDetailsService,
    loginService,
    validateTokenService
};