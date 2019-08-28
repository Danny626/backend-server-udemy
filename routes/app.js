var express = require('express');
var app = express();

// rutas
// req: request, res: response(respuesta a la solicitud), next: cuando se ejecute continue con la sgte extensión con middleware
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'petición realizada correctamente'
    });
});

module.exports = app;