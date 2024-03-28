const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const User = require('../models/userModel');
const validateMongoDbId = require("../utils/validateMongdbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require('fs');

// Create a Product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id; //agregue .id
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
            new: true,
        });
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id; //agregue .id
    try {
        const deleteProduct = await Product.findOneAndDelete({ _id: id });
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Get a Product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// GetAllProduct
const getAllProduct = asyncHandler(async (req, res) => {
    try {

        // Filtering (Filtrando) 
        const queryObj = { ...req.query }; // copia del obj re.query
        const excludeFields = ["page", "sort", "limit", "fields"]; // Campos excluidos
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj); // Transformacion de consulta a cadena
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Reemplazo de operadores de comparacion

        let query = Product.find(JSON.parse(queryStr)); // Creacion consulta MongoDB

        // Sorting (Ordenamiento)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy); // Si hay un parámetro sort en la consulta, se ordenan los resultados según esos campos
        } else {
            query = query.sort("-createdAt") // Si no hay un parámetro sort, se ordena por el campo createdAt en orden descendente
        }

        // Limiting the fields (Limitando los campos)
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields); // Si hay un parámetro fields en la consulta, se seleccionan y devuelven solo esos campos
        } else {
            query = query.select('-__v') // Si no hay un parámetro fields, se excluye el campo __v en los resultados
        }

        // Pagination (Paginacion)
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit; // Se establecen valores para la paginación (número de página, límite de elementos por página, salto)
        query = query.skip(skip).limit(limit); // Se realiza la paginación en la consulta, saltando los elementos anteriores y limitando la cantidad de elementos devueltos
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists") // Se verifica si la página solicitada existe, en caso contrario, se lanza un error
        }
        console.log(page, limit, skip);

        // Response 
        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

// Agregar producto a la Wishlist
const addToWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});

// Rating por user
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        // Cantidad Total de Rating (estrellas)
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});

// Controlador de ruta que maneja la carga de imágenes para un producto
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    console.log(req.files);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

/*Opcion Alternativa: fs.unlink (asincrona)
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    console.log(req.files);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            console.log(file);
            fs.unlink(path, (error) => {
                if (error) {
                    console.error(`Error al eliminar el archivo: ${error.message}`);
                }
            });
        }
        const findProduct = await Product.findByIdAndUpdate(
            id,
            {
                images: urls.map((file) => {
                    return file;
                }),
            },
            {
                new: true,
            }
        );
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});*/

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    uploadImages
};
