const express = require("express");
const app = express();
const port = 8000;
const router = require("./src/routes/auth.routes.js");
const dotenv = require("dotenv");
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}));
dotenv.config("./");
app.use("/auth",router);
app.listen(port, () => {
    console.log(`auth service listening on port ${port}`);
});
