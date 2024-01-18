let mysql = require("mysql2");

let conexion = mysql.createConnection({
    host:'127.0.0.1',
    port: '3306', 
    database:'healthcare',
    user:'jperezv',
    password:'Coche060'
});

conexion.connect(function(error){
    if(error){
throw error;
}else{
    console.log("conexion exitosa");
}
});

module.exports = conexion;
