const cloudinary = require("cloudinary");

// Confuguracion de cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY,
});

// Funcion asincronica que utiliza la biblioteca de Cloudinary 
//para cargar imágenes a su servicio
const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url,
                },
                {
                    resource_type: "auto",
                }
            );
        });
    });
};

module.exports = cloudinaryUploadImg;