const { Router } = require('express');
const { usuariosPost, usuariosGet, actualizarRespuestas, descripcion } = require('../controllers/usuarios');

const router = Router();

router.post('/', usuariosPost );

router.get('/', usuariosGet );

router.put('/respuestas', actualizarRespuestas);

router.post('/descripcion', descripcion);

module.exports = router;