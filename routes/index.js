const express = require('express')
const router = express.Router()
const fs = require('fs');


const noticias = require('../models/Noticia')
const eventos = require('../models/Evento')
const charlas = require('../models/Charla')
const directorio = require('../models/Directorio')
const socios = require('../models/Socio')

// Express manda el hola mundo a la solicitud get del servidor
router.get('/',  async (req, res) => {
    var noti = await noticias.find({});
    var eve = await eventos.find({});
    var charl = await charlas.find({});
    var dir = await directorio.find({});
    var soc = await socios.find({});
    fs.readdir('./public/img/', (err, files) => {
        res.render('index', { 
            files: files, 
            noticias: noti, 
            eventos: eve, 
            charlas: charl, 
            directorio: dir,
            socios: soc 
        });
    });
})

// Exporta el router para poder usarlo donde sea
module.exports = router