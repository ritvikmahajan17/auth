const express = require("express");
const app = express();
const port = 8000;
const router = require("./src/routes/auth.routes.js");
const dotenv = require("dotenv");
app.use(express.json());

dotenv.config("./");
app.use("/auth",router);
app.listen(port, () => {
    console.log(`auth service listening on port ${port}`);
});
