const express = require('express')
const router = express.Router()
const Socio = require('../models/Socio')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const sys = require('sys')
const auth = require("./auth")
const obtenerDict = require('../tools/tools')
const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, async (req, res) => {
    //console.log(Directorio.schema.paths['nombre']['instance'])
    var keys = obtenerDict(Socio.schema.paths)

    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const socios = await Socio.find(searchOptions)
        res.render('socio/index', {
            socios: socios,
            searchOptions: req.query,
            variables: keys,
            seccion: "socio"
        })
    }catch{
        res.render('/');
    }
    
})



// Crear el autor
router.post('/', auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var nombre = fields['nombre']
        var institucion = fields['institucion']

        const socio = new Socio({
            nombre : nombre,
            institucion : institucion
        })
        try {
            const newSocio =  socio.save()
            return res.redirect('/socio')
        }catch (e) {
            console.error(e)
            res.redirect('/socio')
        }
        return res.redirect('/socio');

    });    

    
});


router.post("/edit", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields['nombre']
        institucion = fields['institucion']
        filtro = {'_id': fields['_id']}
        var doc =  Socio.findOne(filtro)
        resultado = await doc.exec()
        resultado.nombre = nombre
        resultado.institucion = institucion
        await resultado.save()

        return res.redirect('/socio');

    }); 

})

router.post("/del", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        id = fields['_id']
        filtro = {'_id' : id}
        Socio.deleteOne(filtro, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            res.redirect("/socio")
          });

    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router