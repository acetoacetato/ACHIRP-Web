
var nPagNoti = 1;
function siguientePaginaNoti(){
    fetch('/noticia/noticias/?' + new URLSearchParams({npag: nPagNoti}))
        .then( (response) =>  response.json()).then( r => {
        var container = document.getElementById("noticias");
        for( key in r.noticias){
            creaNoticia(r.noticias[key], container);
        }
        
        if(r.noticias.length > 0 ) nPagNoti++;
        return 'ok';
    }).catch( e => {
        alert('hubo un error: ' + e);
        return 'error';
    })
}

function creaNoticia(noticia, container){
    notiObj = creaNotiObj(noticia);
    container.appendChild(notiObj);
    //cargaImagen(imagen._id, imagen.imagen);
    notiObj.removeAttribute("hidden");
}

function cargaImagen(id, path){ 
    fetch('/galeria/img/' + path).then( (response) => {
      if(response.ok){
        response.blob().then( (miBlob) => {
          var objectURL = URL.createObjectURL(miBlob);
          var imagen = document.getElementById(id);
          imagen.src = objectURL;
        })
      }
    })
}


function detalles(id) {
    var nombre = document.getElementById('nombre-' + id).innerText;
    var descripcion = document.getElementById('descripcion-' + id).innerText;
    var src = document.getElementById(id).getAttribute("src");

    //document.getElementById('modal-form').reset();
    document.getElementById('modal-imagen').setAttribute('src', '');

    document.getElementById('modal-nombre').innerText = nombre;
    document.getElementById('modal-nombre').setAttribute('value', nombre);
    document.getElementById('modal-descripcion').innerText = descripcion;
    document.getElementById('modal-descripcion').setAttribute('value', descripcion);
    document.getElementById('modal-imagen').setAttribute('src', src);
    document.getElementById('modal-id').setAttribute('value', id);
    
    
} 


function cargarNoticia(inSite, id){
  console.log("funciono")
  fetch('/noticia/noticia/' + id).then( (response) => {
    if(response.ok){
      return response.json();
    } else{
      throw "Error interno, porfavor contacte al administrador";
    }
  }).then( r => {
    noticia = r.noticia
    if(!inSite){
      if( ! /http(s?):\/\//.test(noticia.cuerpo))
        noticia.cuerpo = 'http://' + noticia.cuerpo
      window.open(noticia.cuerpo);
    } else{

      var fecha = formateaFecha(noticia.fecha)
      // Cargar Datos en Modal de Noticia
      $("#modal-titulo-noticia").html(noticia.titulo);
      $("#modal-subtitulo-noticia").html(noticia.desc);
      $("#modal-descripcion-noticia").html(noticia.cuerpo);
      $("#modal-fecha-noticia").html(fecha);
      $("#modal-imagen-noticia").attr('src', '/public/img/noticia/' + noticia.imagen);
      // Hacer Toggle cuando todo esté cargado
      $("#noticiasModal").modal("toggle");
    }
  }).catch( e => {
    alert("Error: " +  e);
  })
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function creaNotiObj(noticia){

  var fecha = formateaFecha(noticia.fecha);
  var imagen = UrlExists("/public/img/noticias/" + noticia.imagen)? "/public/img/noticias/" +noticia.imagen: ""
  var str = `<div class="col-lg-4 col-md-6 col-xs-12" hidden>
                <div class="blog-item">
                  <div class="blog-image">
                    <a href="#">
                      <img class="img-fluid" src="/public/img/noticias/${noticia.imagen}" alt="">
                    </a>
                  </div>
                  <div class="descr">
                    <h3 class="title">
                      <a style="cursor: pointer;" onclick="cargarNoticia(${ noticia.inSite }, '${ noticia._id }')">
                        ${noticia.titulo}
                      </a>
                    </h3>
                    <p> ${noticia.desc} </p>
                  </div>
                  <div class="meta-tags">
                    <span class="date"><i class="lni-calendar"></i> ${fecha} </span> 
                  </div>
                </div>
              </div>`;
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, 'text/html');
  return doc.body.firstChild;
}


