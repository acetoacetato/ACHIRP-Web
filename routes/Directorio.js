const express = require('express')
const router = express.Router()
const Directorio = require('../models/Directorio')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const sys = require('sys')
const auth = require("./auth")

const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, async (req, res) => {
    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const directorio = await Directorio.find(searchOptions)
        res.render('directorio/index', {
            directorio: directorio,
            searchOptions: req.query
        })
    }catch{
        res.render('/');
    }
    
})



// Crear el autor
router.post('/', auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var nombre = fields.nombre
        var institucion = fields.institucion

        const directorio = new Directorio({
            nombre : nombre,
            institucion : institucion
        })
        console.log(directorio)
        try {
            const newDirectorio =  directorio.save()
            return res.redirect('/directorio')
        }catch (e) {
            console.error(e)
            res.render('directorio/new',{
                directorio: directorio,
                errorMessage: 'No se pudo agregar el nuevo directorio'
            })
        }
        return res.redirect('/directorio');

    });    

    
});


router.post("/edit", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields.nombre
        institucion = fields.institucion

        filtro = {'nombre': fields['ant-nombre'], 'institucion': fields['ant-inst']}
        console.log(filtro)
        var doc =  Directorio.findOne(filtro)
        resultado = await doc.exec()
        resultado.nombre = nombre
        resultado.institucion = institucion
        await resultado.save()

        return res.redirect('/directorio');

    }); 

})

router.post("/del", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields.nombre
        institucion = fields.institucion

        filtro = {'nombre': fields['nombre'], 'institucion': fields['institucion']}
        Directorio.deleteOne(filtro, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            res.redirect("/directorio")
          });

    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router