// Requires  //es una import de lib de terceros o personalizadas
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// inicializar variables
var app = express();

// body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// conexión a la bd
mongoose.connection
    .openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true })
    .then(() => {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');
    })
    .catch(err => {
        console.error(err);
    });

// Rutas
// declaramos un middleware, que es algo que se ejecuta antes de que se resuelvan otras rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3000, () => {
    console.log('express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});