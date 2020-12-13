const mongoose = require('mongoose')

const imgSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    fecnac: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Img', imgSchema)