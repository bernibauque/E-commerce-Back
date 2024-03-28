const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require('fs');

// Configura el almacenamiento de archivos para multer, 
//especificando la carpeta de destino y el nombre de archivo 
//único con extensión ".jpeg".
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg"); //.jpeg
    },
});

// Filtro para archivos subidos, permitiendo solo archivos de tipo 
//imagen basados en su mimetype
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(
            {
                message: "Unsupported file format"
            },
            false
        );
    }
};

// Configura el middleware de multer para subir fotos 
//con almacenamiento personalizado, filtro de archivos y 
//límite de tamaño.
const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 },
});

// Redimensiona las imágenes adjuntas a 300x300 píxeles, 
//las convierte a formato JPEG con calidad del 90% y las guarda 
//en una carpeta específica.
const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/products/${file.filename}`);
            fs.unlinkSync(`public/images/products/${file.filename}`);
        })
    );
    next();
};
/* Opcion Alternativa: elimina los archivos de forma síncrona, sin manejar los errores individualmente.
const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    try {
        await Promise.all(
            req.files.map(async (file) => {
                await sharp(file.path)
                    .resize(300, 300)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`public/images/products/${file.filename}`);

                // Eliminar el archivo original después de redimensionarlo
                try {
                    await fs.unlink(`public/images/products/${file.filename}`);
                    console.log(`Archivo eliminado: ${file.filename}`);
                } catch (err) {
                    console.error("Error al eliminar el archivo:", err);
                }
            })
        );

        next();
    } catch (error) {
        console.error("Error al redimensionar las imágenes:", error);
        next(error);
    }
};*/

// Misma funcion para resize y eliminacion pero para blogs
const blogImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/blogs/${file.filename}`);
            fs.unlinkSync(`public/images/blogs/${file.filename}`);
        })
    );
    next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };