const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "samira",
    database: "twitter"
});

db.connect((error) => {
    if (error) throw error;
    // programme s'arrette avec throw
    console.log("Connection to dabase works!");
});

module.exports = db;