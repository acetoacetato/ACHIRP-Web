
var nPag = 1;
function siguientePagina(){
    fetch('/galeria/imagenes/?' + new URLSearchParams({npag: nPag}))
        .then( (response) =>  response.json()).then( r => {
        var galeria = document.getElementById("galeria");
        for( key in r.imagenes){
            var imagen = r.imagenes[key];
            creaImagen(imagen, galeria);
        }
        
        if(r.imagenes.length > 0 ) nPag++;
        return 'ok';
    }).catch( e => {
        alert('hubo un error: ' + e);
        return 'error';
    })
}

function creaImagen(imagen, galeria){
    imgObj = creaImgObj(imagen);
    galeria.appendChild(imgObj);
    cargaImagen(imagen._id, imagen.imagen);
    imgObj.removeAttribute("hidden");
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



function creaImgObj(imagen){

  
    var str = `<div hidden class="col-lg-3 col-md-6 col-xs-12" style="padding-bottom: 34px;" id="img-${imagen._id}">
              <div class="event-item">
                <img class="img-fluid" id="${imagen._id}" src="" style="width: 500px; height:230px" alt="" >
                
                <div class="overlay-text">
                  <div class="content">
                    <h3 id="nombre-${imagen._id}">${imagen.nombre}</h3>
                    <div hidden id="descripcion-${imagen._id}">${imagen.descripcion}</div>
                    <a class="Modal" href="#testModal" onclick="detalles('${imagen._id}')" data-toggle="modal" data-id="1" >View details</a>
                  </div>
                </div>
              </div>
            </div>`;
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body.firstChild;
}


