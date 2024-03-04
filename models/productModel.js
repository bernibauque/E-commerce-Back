const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [],
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        },
    ],
    totalrating: {
        type: String,
        default: 0,
    },
},
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);

// Establecer "select: false" en un campo del esquema de Mongoose,
// se está configurando ese campo para que no se incluya automáticamente
// cuando se realiza una consulta para recuperar documentos de la base
// de datos.