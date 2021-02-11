const express = require('express')
const router = express.Router()
const Imagen = require('../models/Imagen')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const {auth, redirect, apiResponse} = require("./auth")
const obtenerDict = require('../tools/tools')
const exec = require('child_process').exec;
const { ifError } = require('assert')
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, redirect, async (req, res) => {
    var keys = obtenerDict(Imagen.schema.paths)

    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const galeria = await Imagen.find(searchOptions)
        res.render('galeria/index', {
            searchOptions: req.query,
            variables: keys,
            seccion: "galerias"
        })
    }catch{
        res.render('/');
    }
    
})



// Crear el autor
router.post('/', auth, apiResponse, async (req, res) => {
    if(res.headersSent){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var nombre = fields['nombre']
        var descripcion = fields['descripcion']
        var fecha = Date.now()
        var imagen = fields['imagen']

        var imagen = files.imagen.name
        var tempPath = files.imagen.path
        var newPath = path.join(__dirname, '../img/' + imagen)
        var rawData = fs.readFileSync(tempPath)
        var aux = 1;
        var tempImagen = imagen;
        while(fs.existsSync(newPath)){
            var tempImagen = `${aux}-${imagen}`;
            newPath = path.join(__dirname, '../img/' + tempImagen);
            aux++;
        }
        imagen = tempImagen;
        fs.writeFile(newPath, rawData, (err) => {
            if(err)
                console.error(err)
        })
        const imagenGaleria = new Imagen({
            nombre : nombre,
            descripcion : descripcion,
            fecha: fecha,
            imagen: imagen
        })
        try {
            const newImagen =   imagenGaleria.save( (err, doc) => {
                return res.status(200).send({'result': 'success', '_id': doc.id})
            })
            
        }catch (e) {
            console.error(e)
            return res.status(401).send({'status': 'error', 'message': e });
        }

    });    

    
});


router.post("/edit", auth, apiResponse, async (req, res) => {
    if(res.headersSent){
        return res.end();
    }
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields['nombre']
        descripcion = fields['descripcion']
        fecha = fields['fecha']
        imagen = fields['imagen']
        filtro = {'_id': fields['_id']}
        var doc =  Imagen.findOne(filtro)
        resultado = await doc.exec()
        resultado.nombre = (typeof nombre == "undefined")? resultado.nombre : nombre 
        resultado.descripcion = (typeof descripcion == "undefined")? resultado.descripcion : descripcion 
        resultado.fecha = (typeof fecha == "undefined")? resultado.fecha : fecha
        if(files.imagen.name !== ''){
            var imagen = files.imagen.name
            var tempPath = files.imagen.path
            var newPath = path.join(__dirname, '../img/' + imagen)
            var rawData = fs.readFileSync(tempPath)
            var prevPath = path.join(__dirname, '../img/' + resultado.imagen)
            fs.unlink(prevPath, (err) => {
                if(err){
                    console.error(err)
                }
            })

            var aux = 1;
            var tempImagen = imagen;
            while(fs.existsSync(newPath)){
                var tempImagen = `${aux}-${imagen}`;
                newPath = path.join(__dirname, '../img/' + tempImagen);
                aux++;
            }
            imagen = tempImagen;

            fs.writeFile(newPath, rawData, (err) => {
                if(err){
                    console.error(err)
                    return res.status(401).send({ 'result': 'error', 'message' : 'Error al subir archivo, contacte con el administrador' })
                }

            })
            
            resultado.imagen = imagen;

        } else{
            resultado.imagen = resultado.imagen;
        }


        await resultado.save()

        return res.status(200).send({ 'result' : 'success'});

    }); 

})

router.post("/del", auth, apiResponse, async (req, res) => {
    if(res.headersSent){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {

        id = fields['_id']
        filtro = {'_id' : id }
        Imagen.findOneAndDelete(filtro, function (err, doc) {
            if (err){
                return res.status(500).send({result: 'error', msg: err});
            } else{
                // deleted at most one tank document
                var prevPath = path.join(__dirname, '../img/' + doc.imagen);
                fs.unlink(prevPath, (err) => {
                    if(err){
                        console.error(err)
                    }
                })
            res.status(200).send({result: 'success'})
            }
          });
        
    }); 

})

router.get("/imagenes", async (req, res) => {
    var pag = ( typeof req.query.npag == "undefined")? 0:req.query.npag - 1;
    const nPorPagina = 4;
    var galeria = await Imagen.find({});
    var imagenes = galeria.slice(nPorPagina*pag, nPorPagina*pag+nPorPagina);

    res.status(200).send({ 'imagenes' : imagenes});
});



// Acceder a las imagenes de la galería
router.get("/img/:fileid", (req, res) => {
    const { fileid } = req.params;
    var ruta = path.join(__dirname, "../img/" + fileid)
    if(! fs.existsSync(ruta)){
        ruta = path.join(__dirname, "../static_img/gallery.png");
    }
    res.status(200).sendFile(ruta);
})

router.get("/id/:fileid",async (req, res) => {
    const { fileid } = req.params;
    var img = await  Imagen.findById(fileid).exec();

    res.status(200).send({'result': 'success', 'imagen' : img});
})

// Exporta el router para poder usarlo donde sea
module.exports = router