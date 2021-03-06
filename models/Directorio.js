const mongoose = require('mongoose');
// Modelo de una colección de la base de datos
//  Mongodb es una base de datos no relacional, 
//      por lo que las modificaciones hechas en este archivo, 
//      se aplicarán sobre las inserciones siguientes, las anteriores se quedarán igual

// En este caso, Directorio representa el directorio de la organización
const DirectorioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    cargo: {

    },
    institucion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Directorio', DirectorioSchema)