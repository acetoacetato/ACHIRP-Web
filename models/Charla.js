const mongoose = require('mongoose');

// Modelo de una colección de la base de datos
//  Mongodb es una base de datos no relacional, 
//      por lo que las modificaciones hechas en este archivo, 
//      se aplicarán sobre las inserciones siguientes, las anteriores se quedarán igual
const CharlaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    expositor: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    hora: {
        type: String,
        required: true
    },
    lugar: {
        type: String,
        default: "1. Nada",
        required: true,
    },
    slides: {
        type: String,
        default: "#",
        required: true,
    },
    imagen: {
        type: String,
        default: "",
        required: false
    }

});

// Exporta el esquema de Asamblea para ser utilizado en otros .js con include()
module.exports = mongoose.model('Charla', CharlaSchema)