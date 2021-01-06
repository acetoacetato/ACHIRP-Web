const express = require('express')
const router = express.Router()
const Asamblea = require('../models/Asamblea')
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
    // Se obtienen los nombres y tipos de los parámetros de la colección de la base de datos
    //  se usan para crear los formularios de manera dinámica
    var keys = obtenerDict(Asamblea.schema.paths)

    //FIXME: Arreglar la búsqueda
    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const asambleas = await Asamblea.find(searchOptions)
        
        res.render('asamblea/index', {
            asambleas: asambleas,
            searchOptions: req.query,
            variables: keys,
            // Se le ingresa la sección para marcarla en la navBar
            seccion: "asamblea"
        })
    }catch (e){
        console.log(e.message)
        res.render('/');
    }
    
})



// Crear el autor
router.post('/', auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var fecha = fields.fecha
        var inicio = fields.inicio
        var fin = fields.fin
        var lugar = fields.lugar
        var tabla = fields.tabla
        var acuerdos = fields.Acuerdos
        var Acta = fields.Acta

        const asamblea = new Asamblea({
            fecha : fecha,
            inicio : inicio,
            fin : fin,
            lugar : lugar,
            tabla : tabla,
            Acuerdos : acuerdos,
            Acta: Acta
        })
        try {
            const newAsamblea =  asamblea.save()
            return res.redirect('/asamblea')
        }catch (e) {
            console.error(e)
            res.redirect('/asamblea')
        }
        return res.redirect('/asamblea');

    });    

    
});


router.post("/edit", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields.nombre
        institucion = fields.institucion
        filtro = {'_id' : fields._id}
        var doc =  Asamblea.findOne(filtro)
        resultado = await doc.exec()

        resultado.fecha = fields['fecha'];
        resultado.inicio = fields['inicio'];
        resultado.fin = fields['fin'];
        resultado.lugar = fields['lugar'];
        resultado.tabla = fields['tabla']//.replaceAll("\n", "<br>");
        resultado.Acuerdos = fields['Acuerdos']//.replace("\n", "<br>");
        resultado.Acta = fields['Acta'];
        await resultado.save()

        return res.redirect('/asamblea');

    }); 

})

router.post("/del", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields.nombre
        institucion = fields.institucion
        id = fields['_id']
        filtro = { '_id' : id}
        Asamblea.deleteOne(filtro, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            res.redirect("/asamblea")
          });

    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router