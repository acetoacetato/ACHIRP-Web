const jwt = require("jsonwebtoken");


function auth(req, res, next) {
  //console.log(req.cookies)
  const token = req.cookies['jwt']
  if (!token) {
    req.message = {'status': 'error', 'type': 'login'};
    next();
  }

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
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
