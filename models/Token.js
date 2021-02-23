const mongoose = require('mongoose');
// Modelo de una colección de la base de datos
//  Mongodb es una base de datos no relacional, 
//      por lo que las modificaciones hechas en este archivo, 
//      se aplicarán sobre las inserciones siguientes, las anteriores se quedarán igual

// En este caso, Token representa un token para la aplicación
const TokenSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    expire_at: {type: Date, default: Date.now, expires: 3600}
});

module.exports = mongoose.model('Token', TokenSchema)