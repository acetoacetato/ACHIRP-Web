if(process.env.NODE_ENV !== 'production'){
    dotenv = require('dotenv').config({path:__dirname + '/.env'})
}

// Express para manejar las rutas de la aplicación
const express = require('express')
const app = express()

const fs = require('fs');
const http = require('http');
const https = require('https');

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

// El routeador que maneja las rutas de los autores
const authorRouter = require('./routes/asamblea.js')
const imgRouter = require('./routes/img.js')
const noticiaRouter = require('./routes/Noticia.js')
const eventoRouter = require('./routes/Evento.js')
//const libroRouter = require('./routes/libros.js')
//const terminalRouter = require('./routes/terminal.js')
//const ejercicioRouter = require('./routes/ejercicio.js')
const cookieParser = require('cookie-parser')

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


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//La carpeta accesible por todo el front
app.use(express.static('public'))
app.use(express.static('assets'))

//El parseador de los parametros que se pasan a las rutas
app.use(bodyParser.urlencoded({limit: '10mb', extended : false}))
app.use(bodyParser.json())
mongoose.connect(process.env.DATABASE_URL, { 
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.use(express.static(__dirname, { dotfiles: 'allow' } ));


const db = mongoose.connection
db.on('error', err => console.error(err))
db.once('open', () => console.log('conectado a mongoose'))


// Se agrega el indexRouter para manejar el index
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/img', imgRouter)
app.use('/noticia', noticiaRouter)
app.use('/evento', eventoRouter)
//app.use('/libros', libroRouter)
//app.use('/terminal', terminalRouter)
//app.use('/ejercicio', ejercicioRouter)


// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(/*credentials,*/ app);

//Se abre el servidor en el puerto que salga o en el 9000 si es devStart

app.listen(process.env.PORT || 80)



httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

//httpsServer.listen(443, () => {
//	console.log('HTTPS Server running on port 443');
//});












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