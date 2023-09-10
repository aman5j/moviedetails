var mysql = require('mysql');
var pool = mysql.createPool({
    user:'root',
    host:'localhost',
    port:3306,
    password:'1234',
    database:'moviedetails',
    multipleStatements:true,
    connectionLimit:100
})

module.exports = pool;



