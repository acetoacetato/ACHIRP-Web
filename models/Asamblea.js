const mongoose = require('mongoose');
// Modelo de una colección de la base de datos
//  Mongodb es una base de datos no relacional, 
//      por lo que las modificaciones hechas en este archivo, 
//      se aplicarán sobre las inserciones siguientes, las anteriores se quedarán igual

const AsambleaSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    lugar: {
        type: String,
        required: true
    },
    inicio: {
        type: String,
        required: true
    },
    fin: {
        type: String,
        required: true
    },
    tabla: {
        type: String,
        required: true,
    },
    // Después de que se realiza
    Acuerdos: {
        type: String,
    },
    Acta: {
        type: String
    }
});

module.exports = mongoose.model('Asamblea', AsambleaSchema)