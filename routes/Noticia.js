const express = require('express')
const router = express.Router()
const Noticia = require('../models/Noticia')
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
    var keys = obtenerDict(Noticia.schema.paths)
    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const noticias = await Noticia.find(searchOptions)
        
        res.render('noticia/index', {
            noticias: noticias,
            searchOptions: req.query,
            variables: keys,
            seccion: "noticia"
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
        //console.log(fields)
        var titulo = fields['titulo']
        var desc = fields['desc']
        var fecha = fields['fecha']
        var imagen = fields['imagen']
        var inSite = (fields['inSite'] == 'on')
        var cuerpo = fields['cuerpo']
        //console.log(inSite)

        const noticia = new Noticia({
            titulo : titulo,
            desc : desc,
            fecha : fecha,
            imagen : imagen,
            inSite : (inSite)? inSite:false,
            cuerpo : cuerpo
        })
        try {
            const newAsamblea =  noticia.save()
            return res.redirect('/noticia')
        }catch (e) {
            console.error(e)
            res.redirect('/noticia')
        }
        return res.redirect('/noticia');

    });    

    
});


router.post("/edit", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        
        filtro = {'_id' : fields['_id']}
        var doc =  Noticia.findOne(filtro)
        resultado = await doc.exec()

        resultado.titulo = fields['titulo'];
        resultado.desc = fields['desc'];
        resultado.fecha = fields['fecha'];
        resultado.imagen = fields['imagen'];
        //console.log(fields)
        resultado.inSite = (fields['inSite'] == 'on')? true:false;
        resultado.cuerpo = fields['cuerpo'];

        await resultado.save()

        return res.redirect('/noticia');

    }); 

})

router.post("/del", auth, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {

        filtro = {_id : fields['_id']}
        Noticia.deleteOne(filtro, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            res.redirect("/noticia")
          });

    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router