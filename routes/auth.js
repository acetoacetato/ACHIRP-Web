const jwt = require("jsonwebtoken");


module.exports = function(req, res, next) {
  //console.log(req.cookies)
  const token = req.cookies['jwt']
  if (!token) return res.status(401).redirect('/user/login');

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.redirect("/user/login");
  }
};