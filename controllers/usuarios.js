const { response }=  require('express');
const  conexion =  require('../conexion')

const usuariosPost = (req,res = response ) => {
    console.log(req.body);
    const { nroCertificado, contratoPropuesta } = req.body;

  // Validar que ambos campos se hayan proporcionado
  if (!nroCertificado || !contratoPropuesta) {
    res.status(400).json({ error: 'Se deben proporcionar ambos nroCertificado y contratoPropuesta' });
    return;
  }

  // Validación de los identificadores en la tabla Certificado
  conexion.query(
    'SELECT idAsegurado_suscripcion FROM certificado WHERE nroCertificado = ? AND contratoPropuesta = ?',
    [nroCertificado, contratoPropuesta],
    (err, resultsCertificado) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      if (resultsCertificado.length === 0) {
        // Si no se encuentra el certificado, indicar que los datos son incorrectos
        res.status(404).json({ error: 'Datos incorrectos, verifique nroCertificado y contratoPropuesta' });
        return;
      }

      // Si llegamos aquí, significa que la validación fue exitosa
      const idAsegurado_suscripcion = resultsCertificado[0].idAsegurado_suscripcion;
      res.status(200).json({ idAsegurado_suscripcion });
    }
  );
};

const usuariosGet = (req,res = response ) => {
    const { idAseg_suscripcion } = req.body;

    // Validar que el ID se haya proporcionado
    if (!idAseg_suscripcion) {
        res.status(400).json({ error: 'Se debe proporcionar el idAseg_suscripcion' });
        return;
    }

    // Consulta para obtener las preguntas respondidas de la tabla asegurado_suscripcion
    conexion.query(
        'SELECT * FROM asegurado_suscripcion WHERE idAseg_suscripcion = ?',
        [idAseg_suscripcion],
        (err, resultsAsegurado) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }

            if (resultsAsegurado.length === 0) {
                res.status(404).json({ error: 'Datos de asegurado_suscripcion no encontrados' });
            } else {
                res.status(200).json(resultsAsegurado[0]);
            }
        }
    );
    }

    const actualizarRespuestas = (req, res = response) => {
        const { idAseg_suscripcion, preg1, preg2, preg3, preg4, preg5 } = req.body;
      
        // Verificar si ya hay respuestas registradas
        conexion.query(
          'SELECT preg1, preg2, preg3, preg4, preg5 FROM asegurado_suscripcion WHERE idAseg_suscripcion = ?',
          [idAseg_suscripcion],
          (err, results) => {
            if (err) {
              console.error('Error al consultar la base de datos:', err);
              res.status(500).json({ error: 'Error interno del servidor' });
              return;
            }
      
            const respuestasRegistradas = results[0];
      
            // Verificar si ya hay respuestas registradas
            if (respuestasRegistradas.preg1 !== null || respuestasRegistradas.preg2 !== null ||
                respuestasRegistradas.preg3 !== null || respuestasRegistradas.preg4 !== null ||
                respuestasRegistradas.preg5 !== null) {
              res.status(400).json({ error: 'Ya hay respuestas registradas para este id' });
              return;
            }
      
            // Si llegamos aquí, significa que las respuestas son nulas y podemos realizar la actualización
            conexion.query(
              'UPDATE asegurado_suscripcion SET preg1 = ?, preg2 = ?, preg3 = ?, preg4 = ?, preg5 = ? WHERE idAseg_suscripcion = ?',
              [preg1, preg2, preg3, preg4, preg5, idAseg_suscripcion],
              (err) => {
                if (err) {
                  console.error('Error al actualizar respuestas:', err);
                  res.status(500).json({ error: 'Error interno del servidor' });
                  return;
                }
      
                res.status(200).json({ mensaje: 'Respuestas actualizadas correctamente' });
              }
            );
          }
        );
      };
       
    
      const descripcion = (req, res = response) => {
        const { idAseg_suscripcion, pregunta, descripcion } = req.body;
      
        // Validar que se proporcionen todos los datos necesarios
        if (!idAseg_suscripcion || !pregunta || !descripcion) {
          res.status(400).json({ error: 'Se deben proporcionar idAseg_suscripcion, pregunta y descripcion' });
          return;
        }
      
        // Verificar si la pregunta existe antes de registrar en Suscripcion_detalle
        conexion.query(
          'SELECT COUNT(*) AS count FROM suscripcion_detalle WHERE pregunta = ? AND idAseg_suscripcion = ?',
          [pregunta, idAseg_suscripcion],
          (err, results) => {
            if (err) {
              console.error('Error al verificar la existencia de la pregunta:', err);
              res.status(500).json({ error: 'Error interno del servidor' });
              return;
            }
      
            const count = results[0].count;
      
            if (count === 0) {
              // Realizar la inserción en la tabla Suscripcion_detalle
              conexion.query(
                'INSERT INTO suscripcion_detalle (pregunta, descripcion, idAseg_suscripcion) VALUES (?, ?, ?)',
                [pregunta, descripcion, idAseg_suscripcion],
                (err) => {
                  if (err) {
                    console.error('Error al registrar en Suscripcion_detalle:', err);
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                  }
      
                  res.status(200).json({ mensaje: 'Detalle de suscripción registrado correctamente' });
                }
              );
            } else {
              // Si la pregunta ya existe, no se registra en Suscripcion_detalle
              res.status(200).json({ mensaje: 'La pregunta ya tiene un detalle registrado' });
            }
          }
        );
      };
      
           

    module.exports = {
        usuariosPost,
        usuariosGet,
        actualizarRespuestas,
        descripcion,  
    }