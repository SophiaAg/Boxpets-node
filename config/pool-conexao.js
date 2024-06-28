const mysql = require('mysql2')
const dotenv = require("dotenv");
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASWORDITB,
    database: process.env.DB_NAME,
    port: process.env.APP_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) 
        console.log(err)
    else
        console.log("Conectado ao SGBD!")
})

module.exports = pool.promise()

