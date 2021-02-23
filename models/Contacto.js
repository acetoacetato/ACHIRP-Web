const mongoose = require('mongoose');

// Modelo de una colección de la base de datos
//  Mongodb es una base de datos no relacional, 
//      por lo que las modificaciones hechas en este archivo, 
//      se aplicarán sobre las inserciones siguientes, las anteriores se quedarán igual

// En este caso, Contacto es a quien le llegará los mensajes que se mandarán 
//      a través del formulario de contacto de la landing page.
const ContactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Contacto', ContactoSchema)