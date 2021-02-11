const express = require('express')
const router = express.Router()
const Usuario = require('../models/Usuario')
const crypto = require('crypto')
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {auth, redirect} = require("./auth")
const { check, validationResult} = require("express-validator");


router.post('/signup',
    [
        check("email", "Porfavor ingrese un mail válido").isEmail(),
        check("password", "Porfavor ingrese una contraseña válida").isLength({
            min: 6
        })
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("user/signup", { err: errors[0] })
        }

        const {
            email,
            password
        } = req.body;
    
        try {
            let user = await Usuario.findOne({email});
            if(user){
                return res.status(400).json({msj: "Usuario ya existente"});
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
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch(err) {
            console.log(err.message)
            res.status(500).send("Error al guardar")
        }
    }
    );

router.get('/login', (req, res) => {
    res.render('user/login', { err: [undefined] });
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
    
        try {
            let user = await Usuario.findOne({email});
            if(!user){  
                return res.status(400).json({msj: "Usuario no existente"});
            }
            
            const isMatch = await bcrypt.compare(password, user.passwd);
            if (!isMatch)
                return res.render('user/login', { err : [{msg: "Contraseña incorrecta"}] });``

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
                    res.status(200).redirect('/directorio');
                }
            );
        } catch(err) {
            console.log(err.message)
            res.status(500).send("Error al guardar")
        }
    }
    );

    router.get("/me", auth, async (req, res) => {
        try {
          // request.user is getting fetched from Middleware after token authentication
          const user = await Usuario.findById(req.user.id);
          res.render("user", {email : user.email });
        } catch (e) {
          console.log(e.message)
          res.redirect('/user/login');
        }
      });


// Exporta el router para poder usarlo donde sea
module.exports = router