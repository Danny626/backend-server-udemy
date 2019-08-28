var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// ======================================
// Verificar token
//=======================================
// este es un middleware que verifica las peticiones que están literlamente debajo de este

exports.verificaToken = function(req, res, next) {
    // estamos recibiendo el token por el URL
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next(); // significa que si no hay error puedes continuar con las demas sentencias
    });
};