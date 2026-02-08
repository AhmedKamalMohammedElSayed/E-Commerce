/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line import/no-extraneous-dependencies

const sharp = require("sharp");
const asyncHandler = require("express-async-handler");

const crypto = require("crypto");
const categoryModel = require("../models/categorymodel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../MiddleWare/uploadImageMiddleWare");

exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${crypto.randomUUID()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categoryImage/${filename}`);

  req.body.image = filename;
  next();
});

exports.getCategories = factory.getAll(categoryModel);

exports.getCategory = factory.getOne(categoryModel);

exports.createCategory = factory.createOne(categoryModel);

exports.updateCategory = factory.updateOne(categoryModel);

exports.deleteCategory = factory.deleteOne(categoryModel);
