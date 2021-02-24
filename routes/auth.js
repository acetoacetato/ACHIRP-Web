const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const User = require("../models/Usuario");

async function auth(req, res, next) {
  //console.log(req.cookies)
  const token = req.cookies['jwt']
  if (!token) {
    req.message = {'status': 'error', 'type': 'login', 'message': 'Sesión no iniciada o expirada.'};
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    var doc = Usuario.findById(req.user.id);
    var usuario = await doc.exec();
    if(!usuario){
      req.message = {'status': 'error', 'type': 'login', 'message': 'Token no válido'};
      next();
      return;
    }

    next();
    return;
  } catch (e) {
    console.error(e);
    req.message = {'status': 'success', 'message': 'iniciado correctamente', 'type': 'login'};
    next();
  }
};

function redirect(req, res, next){
  if(req.message != undefined){
    return res.redirect('/user/login');
  } else{
    next();
  }
};

function apiResponse(req, res, next){
  if(req.message != undefined && req.message.status != "success"){
    return res.status(200).send(req.message);
  } else{
    next();
  }
};

module.exports = { auth: auth, redirect: redirect, apiResponse: apiResponse} ;
