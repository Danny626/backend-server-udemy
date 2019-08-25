// Requires  //es una import de lib de terceros o personalizadas
var express = require('express');
var mongoose = require('mongoose');

// inicializar variables
var app = express();

// conexión a la bd
mongoose.connection
    .openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true })
    .then(() => {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');
    })
    .catch(err => {
        console.error(err);
    });

// rutas
// req: request, res: response(respuesta a la solicitud), next: cuando se ejecute continue con la sgte extensión con middleware
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'petición realizada correctamente'
    });
});

// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});