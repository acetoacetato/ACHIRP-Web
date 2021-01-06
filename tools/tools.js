
function obtenerDict(paths){
    var keys = {}
    //console.log(paths)
    Object.keys(paths).forEach(key => {

        keys[key] = paths[key]['instance']
        delete keys['__v']
    })

    return keys
}


module.exports = obtenerDict