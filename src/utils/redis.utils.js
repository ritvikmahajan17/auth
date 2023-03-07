const redis = require("redis");

const client = redis.createClient();

client.connect().then(() => {
    console.log("Redis connected");
});
const storeToken = async (token, username) => {
    await client.set(username, token, "EX", 60 * 60);
};

const getToken = async (username) => {
    console.log(username,"username");
    const token = await client.get(username);
    return token;
};

module.exports = { storeToken, getToken };