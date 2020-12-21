const express = require('express')
const router = express.Router()
const Charla = require('../models/Charla')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const sys = require('sys')
const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const charlas = await Charla.find(searchOptions)
        res.render('charla/index', {
            charlas: charlas,
            searchOptions: req.query
        })
    }catch{
        res.render('/');
    }
    
})



// Nuevo autor
router.get('/new', (req, res) => {
    res.render('charla/new', { evento : new Charla()});
})

// Crear el autor
router.post('/', async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var titulo = fields.titulo
        var desc = fields.descripcion
        var fecha= new Date(fields.fecha) + (- new Date(fields.fecha).getTimezoneOffset() / 60)
        var slides = fields.slides
        var lugar = fields.lugar
        var expositor = fields.expositor
        var hora = fields.hora


        //var nombre = files.imagen.name
        //var tempPath = files.imagen.path
        //var newPath = path.join(__dirname, '../public/img/noticias/' + nombre)
        //var rawData = fs.readFileSync(tempPath)

        //fs.writeFile(newPath, rawData, (err) => {
        //    if(err)
        //        console.error(err)
        //})

        console.log(typeof(desc))
        const charla = new Charla({
            titulo : titulo,
            descripcion : desc,
            fecha: fecha,
            slides: slides,
            expositor: expositor,
            lugar: lugar,
            hora: hora
        })
        console.log(charla)
        try {
            const newCharla =  charla.save()
            return res.redirect('/charla')
        }catch (e) {
            console.error(e)
            res.render('charla/new',{
                charla: charla,
                errorMessage: 'No se pudo agregar la nueva charla'
            })
        }
        return res.redirect('/charla');

    });    

    
})

// Exporta el router para poder usarlo donde sea
module.exports = router