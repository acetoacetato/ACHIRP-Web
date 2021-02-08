const express = require('express')
const router = express.Router()
const Directorio = require('../models/Directorio')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const {auth, redirect} = require("./auth")
const obtenerDict = require('../tools/tools')
const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, redirect, async (req, res) => {
    //console.log(Directorio.schema.paths['nombre']['instance'])
    var keys = obtenerDict(Directorio.schema.paths)

    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const directorio = await Directorio.find(searchOptions)
        res.render('directorio/index', {
            directorio: directorio,
            searchOptions: req.query,
            variables: keys,
            seccion: "directorio"
        })
    }catch{
        res.render('/');
    }
    
})



// Crear el autor
router.post('/', auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var nombre = fields['nombre']
        var cargo = fields['cargo']
        var institucion = fields['institucion']
        var imagen = files.imagen.name
        var tempPath = files.imagen.path
        var newPath = path.join(__dirname, '../public/img/directorio/' + imagen)
        var rawData = fs.readFileSync(tempPath)

        fs.writeFile(newPath, rawData, (err) => {
            if(err)
                console.error(err)
        })

        const directorio = new Directorio({
            nombre : nombre,
            institucion : institucion,
            cargo: cargo,
            imagen: imagen
        })
        try {
            const newDirectorio =  directorio.save()
            return res.redirect('/directorio')
        }catch (e) {
            console.error(e)
            res.redirect('/directorio')
        }
        return res.redirect('/directorio');

    });    

    
});


router.post("/edit", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields['nombre']
        institucion = fields['institucion']
        cargo = fields['cargo']
        imagen = fields['imagen']
        filtro = {'_id': fields['_id']}
        var doc =  Directorio.findOne(filtro)
        resultado = await doc.exec()
        resultado.nombre = nombre
        resultado.institucion = institucion
        resultado.cargo = cargo

        if(fields.imagen !== undefined){
            var imagen = files.imagen.name
            var tempPath = files.imagen.path
            var newPath = path.join(__dirname, '../public/img/directorio/' + imagen)
            var rawData = fs.readFileSync(tempPath)
            var prevPath = path.join(__dirname, '../public/img/directorio/' + resultado.imagen)
            fs.unlink(prevPath, (err) => {
                if(err)
                    console.error(err)
                    return
            })
            fs.writeFile(newPath, rawData, (err) => {
                if(err)
                    console.error(err)
            })
            
            resultado.imagen = imagen;

        }


        await resultado.save()

        return res.redirect('/directorio');

    }); 

})

router.post("/del", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields.nombre
        institucion = fields.institucion
        id = fields['_id']

        filtro = {'_id' : id }
        Directorio.deleteOne(filtro, function (err) {
            if (err) return handleError(err);
            // deleted at most one tank document
            res.redirect("/directorio")
          });
        
    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router