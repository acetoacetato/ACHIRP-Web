const express = require('express')
const router = express.Router()
const Noticia = require('../models/Noticia')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const {auth, redirect} = require("./auth")
const obtenerDict = require('../tools/tools')

const exec = require('child_process').exec;
// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, redirect, async (req, res) => {
    var keys = obtenerDict(Noticia.schema.paths)
    var alternativos = { inSite : '¿Noticia en el mismo sitio? ', desc : "Subtitulo", cuerpo : "Link al sitio de la noticia" }
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
            seccion: "noticias",
            alternativos: alternativos
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
        var desc = fields['desc']
        var fecha = fields['fecha']
        var inSite = (fields['inSite'] == 'on')
        var cuerpo = fields['cuerpo']
        var imagen = files.imagen.name
        var tempPath = files.imagen.path
        var newPath = path.join(__dirname, '../public/img/noticia/' + imagen)
        var rawData = fs.readFileSync(tempPath)

        var aux = 1;
        var tempImagen = imagen;
        while(fs.existsSync(newPath)){
            var tempImagen = `${aux}-${imagen}`;
            newPath = path.join(__dirname, '../public/img/noticia/' + tempImagen);
            aux++;
        }
        imagen = tempImagen;

        fs.writeFile(newPath, rawData, (err) => {
            if(err)
                console.error(err)
        })

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


router.post("/edit", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        
        filtro = {'_id' : fields['_id']}
        var doc =  Noticia.findOne(filtro)
        resultado = await doc.exec()

        resultado.titulo = fields['titulo'];
        resultado.desc = fields['desc'];
        resultado.fecha = fields['fecha'];
        //console.log(fields)
        resultado.inSite = (fields['inSite'] == 'on')? true:false;
        resultado.cuerpo = fields['cuerpo'];

        if(files.imagen !== undefined){

            var imagen = files.imagen.name
            var tempPath = files.imagen.path
            var newPath = path.join(__dirname, '../public/img/noticia/' + imagen)
            var rawData = fs.readFileSync(tempPath)
            var prevPath = path.join(__dirname, '../public/img/noticia/' + resultado.imagen)

            var aux = 1;
            var tempImagen = imagen;
            while(fs.existsSync(newPath)){
                var tempImagen = `${aux}-${imagen}`;
                newPath = path.join(__dirname, '../public/img/noticia/' + tempImagen);
                aux++;
            }
            imagen = tempImagen;

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

        return res.redirect('/noticia');

    }); 

})

router.post("/del", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {

        Noticia.findByIdAndDelete(fields['_id'], function (err, doc) {
            if (err) return handleError(err);

            var prevPath = path.join(__dirname, '../public/img/noticia/' + doc.imagen);
            fs.unlink(prevPath, (err) => {
                if(err){
                    console.error(err)
                }
            })
            // deleted at most one tank document
            res.redirect("/noticia")
          });

    }); 

})

router.get("/noticias", async (req, res) => {
    var pag = ( typeof req.query.npag == "undefined")? 0:req.query.npag - 1;
    const nPorPagina = 4;
    var galeria = await Noticia.find({});
    var noticias = galeria.slice(nPorPagina*pag, nPorPagina*pag+nPorPagina);
    res.status(200).send({ 'noticias' : noticias});
});


router.get("/noticia/:id", async (req, res) => {
    var { id } = req.params;
    var noticia = await Noticia.findById(id).exec();
    res.status(200).send({ 'result': 'success', 'noticia' : noticia });
});




// Exporta el router para poder usarlo donde sea
module.exports = router