const express = require('express');
const cors = require('cors')

class Server{

 constructor(){
    this.app = express();
    this.port= process.env.PORT || 3000;
    this.usuariosPath= '/api/usuarios';
    //Middlewares
    this.middlewares();
    //routes de mi app
    this.routes();
 }

middlewares(){

//Cors
this.app.use(cors());

//Parseo y Lectura del body
this.app.use(express.json());

    //Directorio publico
this.app.use(express.static('public'));
}

routes(){
  
    this.app.use(this.usuariosPath ,require('../routes/usuarios')); 

}

listen(){
    this.app.listen(this.port, ()=> { 
        console.log('Servidor corriendo en puerto',this.port);
    });
}

}


module.exports = Server;
