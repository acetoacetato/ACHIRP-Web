const express = require('express')
const router = express.Router()
const Contacto = require('../models/Contacto')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const {auth, redirect} = require("./auth")
const obtenerDict = require('../tools/tools')
const exec = require('child_process').exec;
var nodemailer = require('nodemailer');

// Express manda el hola mundo a la solicitud get del servidor
router.get('/', auth, redirect, async (req, res) => {
    //console.log(Directorio.schema.paths['nombre']['instance'])
    var keys = obtenerDict(Contacto.schema.paths)

    let searchOptions = {}
    if(req.query.nombre != null && req.query.nombre.trim() !== ''){
        searchOptions.nombre = new RegExp(req.query.nombre.trim(), 'i')
    }
    try{
        const contactos = await Contacto.find(searchOptions)
        res.render('contacto/index', {
            contactos: contactos,
            searchOptions: req.query,
            variables: keys,
            seccion: "contacto"
        })
    }catch{
        res.render('/');
    }
    
})



// Crear el autor
router.post('/add', auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var nombre = fields['nombre']
        var correo = fields['correo']

        const contacto = new Contacto({
            nombre : nombre,
            correo : correo,
        })
        try {
            const newContacto =  contacto.save()
            return res.redirect('/contacto')
        }catch (e) {
            console.error(e)
            res.redirect('/contacto')
        }
        return res.redirect('/contacto');

    });    

    
});


router.post("/edit", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields['nombre']
        correo = fields['correo']
        filtro = {'_id': fields['_id']}
        var doc =  Contacto.findOne(filtro)
        resultado = await doc.exec()
        resultado.nombre = nombre
        resultado.correo = correo 


        await resultado.save()

        return res.redirect('/contacto');

    }); 

})

router.post("/del", auth, redirect, async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {

        id = fields['_id']

        filtro = {'_id' : id }
        Contacto.deleteOne(filtro, function (err) {
            if (err) 
                console.error(err)
            // deleted at most one tank document
            res.redirect("/contacto")
          });
        
    }); 

})

router.post("/send", async (req, res) => {
    
    var form = new formidable.IncomingForm();
    form.parse(req,  async (err, fields, files) => {
        nombre = fields.nombre
        email = fields.email
        asunto = fields.asunto
        mensaje = fields.mensaje
        const contactos = await Contacto.find({})
        correos = ""
        if(contactos.length == 0){
            correos = "alenfigueroam@gmail.com"
        }
        contactos.forEach( contacto => {
            correos += " " + contacto.correo
        })
        correos = correos.split(' ').join(', ')
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'alen.figueroa.m@mail.pucv.cl',
              pass: 'cBc5536652'
            }
          });
          
          var mailOptions = {
            from: 'alen.figueroa.m@mail.pucv.cl',
            to: correos,
            subject: '[ACHIRP] ' + asunto,
            text: nombre + ' ( correo ' + email + ' ) manda el siguiente mensaje: \n'
                + mensaje
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
            
          });

          res.redirect("/")
        
        
    }); 

})

// Exporta el router para poder usarlo donde sea
module.exports = router