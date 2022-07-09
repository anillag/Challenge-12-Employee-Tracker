const mysql2 = require("mysql2");
require("dotenv").config();

const db = mysql2.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "employees",
    },
    console.log("Connected to employee database")
);

module.exports = db;