if(process.env.NODE_ENV !== 'production'){
    dotenv = require('dotenv').config({path:__dirname + '/.env'})
}

// Express para manejar las rutas de la aplicación
const express = require('express')
const app = express()

const fs = require('fs');
const http = require('http');
const https = require('https');
const cookieParser = require('cookie-parser');


// Para subida de archivos
var formidable = require('formidable');

//const privateKey = fs.readFileSync('/etc/letsencrypt/live/abmodel.cl/privkey.pem', 'utf8');
//const certificate = fs.readFileSync('/etc/letsencrypt/live/abmodel.cl/cert.pem', 'utf8');
//const ca = fs.readFileSync('/etc/letsencrypt/live/abmodel.cl/chain.pem', 'utf8');


//const credentials = {
//	key: privateKey,
//	cert: certificate,
//	ca: ca
//};

//Express layouts para usar trozos de html que vayan en cada pagina necesaria
const expressLayouts = require('express-ejs-layouts')

const bodyParser = require('body-parser')
const cors = require('cors')
/**
 *      Ruteadores
 */

app.use(cors());
// El routeador principal, que maneja las rutas del index
const indexRouter = require('./routes/index.js')

// El routeador que maneja las rutas de las secciones de administración
const authorRouter = require('./routes/asamblea.js')
const galeriaRouter = require('./routes/galeria.js')
const noticiaRouter = require('./routes/Noticia.js')
const eventoRouter = require('./routes/Evento.js')
const charlaRouter = require('./routes/Charla.js')
const socioRouter = require('./routes/Socio.js')
const usuarioRouter = require('./routes/user.js')
const asambleaRouter = require('./routes/asamblea.js')
const directorioRouter = require('./routes/Directorio.js')
const contactoRouter = require('./routes/Contacto.js')


/**
 *      Base de datos
 */

const mongoose = require('mongoose')

//Se setean las cosas como carpeta de vistas (MVC) y los layouts
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(cookieParser());


// Agregamos headers para facilitar los formulatios
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Las carpetas accesible por todo el front
app.use(express.static('public'))
app.use(express.static('assets'))

//El parseador de los parametros que se pasan a las rutas
app.use(bodyParser.urlencoded({limit: '10mb', extended : false}))
app.use(bodyParser.json())

// La conexión a la base de datos,
//  process.env.DATABASE_URL se carga desde un archivo .env que 
//      se incluye en la misma carpeta que este archivo.
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.use(express.static(__dirname, { dotfiles: 'allow' } ));


const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('conectado a mongoose'))


// Se agregan cada una de las rutas de la aplicación con su ruteador correspondiente
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/galeria', galeriaRouter)
app.use('/noticia', noticiaRouter)
app.use('/evento', eventoRouter)
app.use('/charla', charlaRouter)
app.use('/socio', socioRouter)
app.use('/user', usuarioRouter)
app.use('/asamblea', asambleaRouter)
app.use('/directorio', directorioRouter)
app.use('/contacto', contactoRouter)

// Para incluir el manejo de cookies, se utiliza para mantener sesiones iniciadas
app.use(cookieParser())







// Si se desea agregar https al sitio, descomentar estas líneas

// Starting both http & https servers
//const httpServer = http.createServer(app);
//const httpsServer = https.createServer(/*credentials,*/ app);

//httpServer.listen(process.env.PORT, () => {
//	console.log('HTTP Server running on port 80');
//});
//
//httpsServer.listen(443, () => {
//	console.log('HTTPS Server running on port 443');
//});


//Se abre el servidor en el puerto que salga o en el 9000 si es devStart
app.listen(process.env.PORT || 80)









///////////////////////Para administración de archivo

//////////////////////Borrado (https://flaviocopes.com/how-to-remove-file-node/)
///////////
///////////  const fs = require('fs')
///////////  
///////////  const path = './file.txt'
///////////  
///////////  fs.unlink(path, (err) => {
///////////    if (err) {
///////////      console.error(err)
///////////      return
///////////    }
///////////  
///////////    //file removed
///////////  })




///////////// Subida (https://www.w3schools.com/nodejs/nodejs_uploadfiles.asp)

////////// El front

//var http = require('http');

////// http.createServer(function (req, res) {
//////   res.writeHead(200, {'Content-Type': 'text/html'});
//////   res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
//////   res.write('<input type="file" name="filetoupload"><br>');
//////   res.write('<input type="submit">');
//////   res.write('</form>');
//////   return res.end();
////// }).listen(8080);

 ////////////// El back
////////////  var http = require('http');
////////////  var formidable = require('formidable');
/////////// http.createServer(function (req, res) {
///////////   if (req.url == '/fileupload') {
///////////     var form = new formidable.IncomingForm();
///////////     form.parse(req, function (err, fields, files) {
///////////       res.write('File uploaded');
///////////       res.end();
///////////     });
///////////   } else {
///////////     res.writeHead(200, {'Content-Type': 'text/html'});
///////////     res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
///////////     res.write('<input type="file" name="filetoupload"><br>');
///////////     res.write('<input type="submit">');
///////////     res.write('</form>');
///////////     return res.end();
///////////   }
/////////// }).listen(8080);