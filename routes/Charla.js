const express = require('express')
const router = express.Router()
const Charla = require('../models/Charla')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const {auth, redirect} = require("./auth")
const obtenerDict = require('../tools/tools')

const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, redirect, async (req, res) => {
    var keys = obtenerDict(Charla.schema.paths)
    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const charlas = await Charla.find(searchOptions)
        
        res.render('charla/index', {
            charlas: charlas,
            searchOptions: req.query,
            variables: keys,
            seccion: "charla"
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
        //console.log(fields)
        var titulo = fields['titulo']
        var descripcion = fields['descripcion']
        var expositor = fields['expositor']
        var fecha = fields['fecha']
        var hora = fields['hora']
        var lugar = fields['lugar']
        var slides = fields['slides']

        var imagen = files.imagen.name
        var tempPath = files.imagen.path
        var newPath = path.join(__dirname, '../public/img/charla/' + imagen)
        var rawData = fs.readFileSync(tempPath)

        fs.writeFile(newPath, rawData, (err) => {
            if(err)
                console.error(err)
        })
        

        const charla = new Charla({
            titulo : titulo,
            descripcion : descripcion,
            expositor: expositor,
            fecha : fecha,
            hora : hora,
            lugar : lugar,
            slides : slides,
            imagen : imagen
        })
        try {
            const newAsamblea =  charla.save()
            return res.redirect('/charla')
        }catch (e) {
            console.error(e)
            res.redirect('/charla')
        }
        return res.redirect('/charla');

    });    

    
});


router.post("/edit", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        
        filtro = {'_id' : fields['_id']}
        var doc =  Charla.findOne(filtro)
        resultado = await doc.exec()

        resultado.titulo = fields['titulo'];
        resultado.descripcion = fields['descripcion'];
        resultado.expositor = fields['expositor'];
        resultado.fecha = fields['fecha'];
        resultado.hora = fields['hora'];
        resultado.lugar = fields['lugar'];
        resultado.slides = fields['slides'];

        if(files.imagen !== undefined){
            var imagen = files.imagen.name
            var tempPath = files.imagen.path
            var newPath = path.join(__dirname, '../public/img/charla/' + imagen)
            var rawData = fs.readFileSync(tempPath)
            var prevPath = path.join(__dirname, '../public/img/charla/' + resultado.imagen)
            fs.unlinkSync(prevPath)
            fs.writeFile(newPath, rawData, (err) => {
                if(err)
                    console.error(err)
            })
            
            resultado.imagen = imagen;

        }

        await resultado.save()

        return res.redirect('/charla');

    }); 

})

router.post("/del", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {

        filtro = {_id : fields['_id']}
        Charla.findByIdAndDelete(filtro, function (err, doc) {
            if (err) return handleError(err);

            var prevPath = path.join(__dirname, '../public/img/charla/' + doc.imagen);
            fs.unlink(prevPath, (err) => {
                if(err){
                    console.error(err)
                }
            })
            // deleted at most one tank document
            res.redirect("/charla")
          });

    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router