let mysql = require("mysql2");
require('dotenv').config();

let conexion = mysql.createConnection({
 host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'healthcare',
    user: process.env.DB_USER || 'jperezv',
    password: process.env.DB_PASSWORD || 'Coche060'
});

conexion.connect(function(error){
    if(error){
throw error;
}else{
    console.log("conexion exitosa");
}
});

module.exports = conexion;
