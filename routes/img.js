const express = require('express')
const router = express.Router()
const Img = require('../models/Imagen')
const crypto = require('crypto')
var formidable = require('formidable');
const sys = require('sys')
const exec = require('child_process').exec;
const path = require('path')
const fs = require('fs')


// Express manda el hola mundo a la solicitud get del servidor
router.get('/', async (req, res) => {
    console.log("hola")
    fs.readdir('./public/img/', (err, files) => {
        
        res.render('img/index', { files: files });
    })    
})


// Nuevo autor
router.get('/new', (req, res) => {
    res.render('img/new', { author : new Img()});
})

// Crear el autor
router.post('/', (req, res) => {

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var nombre = files.archivo.name
        var tempPath = files.archivo.path
        var newPath = path.join(__dirname, '../public/img/' + nombre)
        var rawData = fs.readFileSync(tempPath)

        fs.writeFile(newPath, rawData, (err) => {
            if(err)
                console.error(err)
        })

        return res.redirect('/');
    });    

    const autor = new Img({
        nombre : req.body.nombre,
        fecnac : req.body.fecnac
    })


})

// Exporta el router para poder usarlo donde sea
module.exports = router