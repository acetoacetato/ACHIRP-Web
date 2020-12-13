const express = require('express')
const router = express.Router()
const Evento = require('../models/Evento')
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
        const eventos = await Evento.find(searchOptions)
        res.render('evento/index', {
            eventos: eventos,
            searchOptions: req.query
        })
    }catch{
        res.render('/');
    }
    
})



// Nuevo autor
router.get('/new', (req, res) => {
    res.render('evento/new', { evento : new Evento()});
})

// Crear el autor
router.post('/', async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var titulo = fields.titulo
        var desc = fields.desc
        var fecha= new Date(fields.fecha) + (- new Date(fields.fecha).getTimezoneOffset() / 60)
        var link = fields.link
        var ubicacion = fields.ubicacion
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
        const evento = new Evento({
            titulo : titulo,
            desc : desc,
            fecha: fecha,
            link: link,
            expositor: expositor,
            ubicacion: ubicacion,
            hora: hora
        })
        console.log(evento)
        try {
            const newEvento =  evento.save()
            return res.redirect('/evento')
        }catch (e) {
            console.error(e)
            res.render('evento/new',{
                evento: evento,
                errorMessage: 'No se pudo agregar el nuevo evento'
            })
        }
        return res.redirect('/evento');

    });    

    
})

// Exporta el router para poder usarlo donde sea
module.exports = router