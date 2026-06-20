import express = require("express");
import dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.get("/api/health", (req, res) => { 
    res.json({ status: "ok" });
});

app.listen(port, () => {
    console.log(`Backend is running on http://localhost:${port}`);
});