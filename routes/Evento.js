const express = require('express')
const router = express.Router()
const Evento = require('../models/Evento')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const {auth, redirect} = require("./auth")
const obtenerDict = require('../tools/tools')

const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, redirect, async (req, res) => {
    var keys = obtenerDict(Evento.schema.paths)
    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const eventos = await Evento.find(searchOptions)
        
        res.render('evento/index', {
            eventos: eventos,
            searchOptions: req.query,
            variables: keys,
            seccion: "evento"
        })
    }catch (e){
        console.log(e.message)
        res.render('/');
    }
    
})



// Crear el autor
router.post('/', auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var abreviacion = fields['abreviacion']
        var nombre = fields['nombre']
        var descripcion = fields['descripcion']
        var link = fields['link']

        const evento = new Evento({
            abreviacion : abreviacion,
            nombre : nombre,
            descripcion : descripcion,
            link : link
        })
        try {
            const newAsamblea =  evento.save()
            return res.redirect('/evento')
        }catch (e) {
            console.error(e)
            res.redirect('/evento')
        }
        return res.redirect('/evento');

    });    

    
});


router.post("/edit", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        
        filtro = {'_id' : fields['_id']}
        var doc =  Evento.findOne(filtro)
        resultado = await doc.exec()

        resultado.abreviacion = fields['abreviacion']
        resultado.nombre = fields['nombre']
        resultado.descripcion = fields['descripcion']
        resultado.link = fields['link']


        await resultado.save()

        return res.redirect('/evento');

    }); 

})

router.post("/del", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {

        filtro = {_id : fields['_id']}
        Evento.deleteOne(filtro, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            res.redirect("/evento")
          });

    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router