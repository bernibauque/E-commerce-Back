const mongoose = require("mongoose");

//La función validateMongoDbId utiliza mongoose para verificar 
//la validez de un ID de MongoDB y arroja un error si no es válido.
const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("This ID is not valid or Not Found");
};
module.exports = validateMongoDbId;