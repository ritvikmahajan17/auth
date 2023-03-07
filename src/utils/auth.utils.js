const jwt = require("jsonwebtoken");

const getAccesToken = (user) => {
    return jwt.sign(user,process.env.SECRET_KEY,{ expiresIn: "1801s" });
};

const validateToken = (token) => {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    return decode;
};



module.exports = {
    getAccesToken,
    validateToken
};