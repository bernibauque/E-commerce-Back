const mongoose = require('mongoose'); // Borrar si ya ha sido requerido previamente
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Declara el esquema del modelo de Mongo
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    cart: {
        type: Array,
        default: [],
    },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        timestamps: true,
    }
);

// Encriptar la contraseña antes de que se guarde en la BD
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metodo para verificar si la contraseña ingresada coincide con la almacenada en la BD
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Metodo de Generación y Almacenamiento Seguro de Tokens de Reinicio de Contraseña
userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resettoken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10 minutes
    return resettoken;
};


//Exportamos el modelo
module.exports = mongoose.model('User', userSchema);