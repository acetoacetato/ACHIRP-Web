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
    res.render('index/index');
});

router.get('/noticias', async (req, res) => {
    var noti = await noticias.find({});
    res.render('index/noticias', {
        noticias: noti
    })
})
router.get('/eventos', async (req, res) => {
    var eve = await eventos.find({});
    res.render('index/eventos', {
        eventos: eve
    })
})
router.get('/charlas', async (req, res) => {
    var charl = await charlas.find({});
    res.render('index/charlas', {
        charlas: charl
    })
})
router.get('/directorios', async (req, res) => {
    var dir = await directorio.find({});
    res.render('index/directorio', {
        directorio: dir
    })
})
router.get('/socios', async (req, res) => {
    var soc = await socios.find({});
    res.render('index/socios', {
        socios: soc
    })
})

// Exporta el router para poder usarlo donde sea
module.exports = router