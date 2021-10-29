const express = require('express')
const router = express.Router()
const Usuario = require('../models/Usuario')
const formidable = require('formidable')

const crypto = require('crypto')
const {auth, redirect, apiResponse} = require("./auth")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require('../models/Token');
credenciales = require('./credenciales.json');
const { check, validationResult} = require("express-validator");
var nodemailer = require('nodemailer');


router.post('/signup', auth, apiResponse,
    [
        check("email", "Porfavor ingrese un mail válido").isEmail(),
        check("password", "Porfavor ingrese una contraseña válida").isLength({
            min: 6
        })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(200).send({"result": 'error', 'message': errors[0]})
        }

        const {
            email,
            password
        } = req.body;
    
        try {
            let user = await Usuario.findOne({email});
            if(user){
                return res.status(200).json({result: 'error',  msj: "Usuario ya existente"});
            }
            user = new Usuario({ email: email, passwd: password })

            const salt = await bcrypt.genSalt(10);
            user.passwd = await bcrypt.hash(password, salt);

            await user.save();


            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({ result: 'success'});
                }
            );
        } catch(err) {
            console.log(err.message)
            res.status(500).send({result: 'error', 'message': 'Error al guardar'});
        }
    }
    );

router.get('/login', (req, res) => {
    res.render('user/login', { err: [undefined] });
});

router.get('/', auth, redirect, async (req, res) => {
    var usuarios = await  Usuario.find({}).select({_id: 1, __v:0, passwd: 0, createdAt: 0});

    res.render('user/index', {usuarios: usuarios, seccion: 'usuarios'});
});

router.post('/del', auth, apiResponse, async (req, res) => {
    
    if(res.headersSent){
        return;
    }
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        var id = fields['_id'];
        Usuario.findByIdAndDelete(id, (err, doc) => {
            if(err){
                return res.status(200).send({'status': 'error', 'message': err.message});
            }

            return res.redirect("/user");
        });
    });
    
});

router.post('/recuperar', async(req, res) => {
    var token = crypto.randomBytes(20).toString('hex');
    var { correo } = req.body;
    var expiracion = new Date();



    expiracion.setDate(expiracion.getDate() + 1);
    const tokenObj = new Token({
        hash: token,
        correo: correo, 
        tipo: "recuperar"
    });
    try {
        const newToken =  tokenObj.save()
    }catch (e) {
        console.error(e);
        res.status(200).send({'result': 'error', 'message': 'No se pudo establecer el token.'})
    }

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: credenciales.mailer.email,
          pass: credenciales.mailer.password
        }
      });
      
      var link = credenciales.host.recuperar + '/' + token
      var mailOptions = {
        from: credenciales.mailer.email,
        to: correo,
        subject: '[ACHIRP] Recuperación de Contraseña',
        html: `Ha solicitado recuperar la contraseña a la página de ACHIRP.
         Para establecer una nueva, haga click en el siguiente enlace:<br>
            <a href="${link}">Haga Click Aquí</a><br><br>

            Nota: El enlace será válido <b>sólo</b> hasta 1 hora después de recibido el correo.`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        
      });
    res.status(200).send({'result': 'success', 'message': 'Se ha enviado un correo de recuperación.'});
});

router.get('/restablecer/:token', async (req, res) => {
    var {token} = req.params
    // Verificar token, renderizar
    var doc = Token.findOne({ hash: token });
    var elemento = await doc.exec();
    if(!elemento){
        return res.render('user/restablecer', { 'result': 'error', 'message': 'Token inválido o expirado.'});
    }

    return res.render('user/restablecer', { 'result': 'success', 'email': elemento.correo, 'token': token});

});

router.post('/restablecer', [
        check("password", "Porfavor ingrese una contraseña válida").isLength({
            min: 6
        })
    ],async(req, res)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("user/restablecer", { err: errors[0] })
        }

        const {
            password,
            token
        } = req.body;
    
        try {
            var doc = Token.findOne({ hash: token });
            var elemento = await doc.exec();
            doc = Usuario.findOne({email: elemento.correo});
            var user = await doc.exec();
            if(!user){
                return res.status(400).json({msj: "Usuario no existe"});
            }

            const salt = await bcrypt.genSalt(10);
            user.passwd = await bcrypt.hash(password, salt);

            Token.findOneAndDelete({hash: token}, (err, doc) => {
                if(doc)
                    return doc;
            });
            await user.save();
            return res.status(200).redirect("/user/login");

        } catch(err) {
            console.log(err.message)
            res.status(500).send("Error al guardar")
        }
})

router.get('/users', auth, apiResponse, async (req, res) => {
    var usuarios = await  Usuario.find({}).select({_id: 1, __v:0, passwd: 0, createdAt: 0});

    res.status(200).send({ 'result': 'success', 'usuarios' : usuarios });
});

router.post('/login',
    [
        check("email", "Email o contraseña inválidos").isEmail(),
        check("password", "Email o contraseña inválidos").isLength({
            min: 6
        })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("user/login", { err : [errors.errors[0]]})
        }

        const {
            email,
            password
        } = req.body;
    
        console.log(email);
        console.log(password);

        try {

            let user = await Usuario.findOne({email});
            if(!user){  
                return res.render('user/login', { err : [{msg: "Usuario inexistente"}] });
            }
            
            const isMatch = await bcrypt.compare(password, user.passwd);
            if (!isMatch)
                return res.render('user/login', { err : [{msg: "Contraseña incorrecta"}] });

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: "3h"
                },
                (err, token) => {
                    if (err) throw err;
                    res.cookie('jwt', token, { expires: new Date(Date.now() + (3*60*60*1000) - 3) })
                    res.status(200).redirect('/galeria');
                }
            );
        } catch(err) {
            console.log(err.message)
            res.status(500).send("Error al guardar")
        }
    }
    );



// Exporta el router para poder usarlo donde sea
module.exports = router