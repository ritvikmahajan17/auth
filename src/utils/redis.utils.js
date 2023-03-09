const redis = require("redis");


const config = {
    socket: {
        host: process.env.REDIS_HOST,
        port: 6379,
    },
};
const client = redis.createClient(config);

client.connect().then(() => {
    console.log("Redis connected");
});
const storeToken = async (token, email) => {
    const response=await client.set(token,email, "EX", 60 * 60);
    return response;
};

const getToken = async (token) => {
    // console.log(email,"email");
    const redisToken = await client.get(token);
    return redisToken;
};

module.exports = { storeToken, getToken,client };