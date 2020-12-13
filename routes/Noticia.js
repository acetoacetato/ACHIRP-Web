const express = require('express')
const router = express.Router()
const Noticia = require('../models/Noticia')
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
        const noticias = await Noticia.find(searchOptions)
        res.render('noticia/index', {
            noticias: noticias,
            searchOptions: req.query
        })
    }catch{
        res.render('/');
    }
    
})



// Nuevo autor
router.get('/new', (req, res) => {
    res.render('noticia/new', { noticia : new Noticia()});
})

// Crear el autor
router.post('/', async (req, res) => {
    
    console.log(req.body)
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var titulo = fields.titulo
        var desc = fields.desc
        var fecha= fields.fecha
        var nombre = files.imagen.name
        var tempPath = files.imagen.path
        var newPath = path.join(__dirname, '../public/img/noticias/' + nombre)
        var rawData = fs.readFileSync(tempPath)

        fs.writeFile(newPath, rawData, (err) => {
            if(err)
                console.error(err)
        })
        const noticia = new Noticia({
            titulo : titulo,
            desc : desc,
            fecha: fecha,
            imagen: nombre
        })
        try {
            const newNoticia =  noticia.save()
            return res.redirect('/noticia')
        }catch (e) {
            console.error(e)
            res.render('noticia/new',{
                noticia: noticia,
                errorMessage: 'No se pudo agregar la nueva noticia'
            })
        }
        return res.redirect('/noticia');

    });    

    
})

// Exporta el router para poder usarlo donde sea
module.exports = router