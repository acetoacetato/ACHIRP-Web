
// Obtiene un diccionario con las claves del modelo, junto con su tipo de dato.
//   Recibe: 
//      paths = Esquema de mongoose
//   Retorna:
//      keys: diccionario de claves = los datos del modelo y valores = tipo de dato
function obtenerDict(paths){
    var keys = {}
    Object.keys(paths).forEach(key => {

        keys[key] = paths[key]['instance']
        delete keys['__v']
    })

    return keys
}


module.exports = obtenerDict