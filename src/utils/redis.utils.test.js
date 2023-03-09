const { storeToken, getToken, client } = require("../../src/utils/redis.utils");

describe("check redis functions", () => {
    it("should store token in redis", async () => {
        jest.spyOn(client, "set").mockResolvedValue("OK");
        const response = await storeToken("token", 1);
        expect(response).toEqual("OK");
    });
    it("should get token from redis", async () => {
        jest.spyOn(client, "get").mockResolvedValue("token");
        const response = await getToken("abcde");
        expect(response).toEqual("token");
    });
});