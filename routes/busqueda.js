var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// ================================
//  Búsqueda por colección
// ================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;

    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/colección no válido' }
            });
    }

    // [tabla] entre llaves es propiedades de objeto procesadas
    // sirve para mostrar el resultado de lo que contiene esa variable en este caso tabla
    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});

// ================================
//  Búsqueda General
// ================================
// rutas
// req: request, res: response(respuesta a la solicitud), next: cuando se ejecute continue con la sgte extensión con middleware
app.get('/todo/:busqueda', (req, res, next) => {
    // Hay 2 tipos de parámetros o argumentos para los servicios REST que estamos creando... los opcionales y lo obligatorios
    // Obligatorios: Están definidos en la RUTA y son necesarios ya que sin ellos, no funciona el servicio, estos los leemos con los req.params.busqueda  (por ejemplo)
    // Opcionales: Son los que visualmente no están en la ruta, pero tu sabes que los pueden enviar, y si los envían los usas, pero si no los envían no pasa nada, para esto los leemos así req.query.desde
    var busqueda = req.params.busqueda;
    // aqui hacemos insensible al valor de búsqueda que llega con expresion regular
    var regex = new RegExp(busqueda, 'i');

    // el all permite mandar un arreglo de promesas y si todas responden va con then y si falla va con catch
    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar Hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombe email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar Médicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar los Usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;