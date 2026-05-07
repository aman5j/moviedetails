// var mysql = require('mysql');
// var pool = mysql.createPool({
//     user:'root',
//     host:'localhost',
//     port:3306,
//     password:'1234',
//     database:'moviedetails',
//     multipleStatements:true,
//     connectionLimit:100
// })

// module.exports = pool;

require('dotenv').config(); // Loads the variables from .env
var mysql = require("mysql2");

var pool = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, //parseInt(process.env.DB_PORT)
    database: process.env.DB_NAME,
    multipleStatements: true,
    connectionLimit: 100,
    ssl: {
        rejectUnauthorized: false 
    }
});

module.exports = pool;



