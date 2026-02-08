const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (model) =>
  asyncHandler(async (req, res, next) => { // Added 'return' via arrow function shorthand
    const { id } = req.params;
    const doc = await model.findByIdAndDelete(id);
    if (!doc) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send(); // Standard for delete
  });

exports.updateOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const item = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!item) {
      return next(new ApiError(`No item found for this id: ${req.params.id}`, 404));
    }
    res.status(200).json({ data: item });
  });

exports.createOne = (model) =>
  asyncHandler(async (req, res) => {
    const item = await model.create(req.body);
    res.status(201).json({ data: item });
  });

exports.getOne = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const item = await model.findById(id);
    if (!item) {
      return next(new ApiError(`No item found for this id: ${id}`, 404));
    }
    res.status(200).json({ data: item });
  });

exports.getAll = (model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const documentCounts = await model.countDocuments();

    const apiFeatures = new ApiFeatures(model.find(filter), req.query)
      .paginate(documentCounts)
      .filter()
      .limiting()
      .searching() // Removed "Brands" to make it generic for all models
      .sorting();

    const { mongooseQuery, paginationResult } = apiFeatures;
    const items = await mongooseQuery;

    res.status(200).json({
      results: items.length,
      paginationResult,
      data: items,
    });
  });