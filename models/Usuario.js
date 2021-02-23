const mongoose = require('mongoose');

// Modelo de administradores de la organización. 
//  Utilizado para la edición de los datos de la landing page
const UsuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    passwd: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }

});

module.exports = mongoose.model('Usuario', UsuarioSchema)