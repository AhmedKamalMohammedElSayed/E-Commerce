const SubCategoryModel = require("../models/subCategory");
const factory = require("./handlerFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};


exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.getSubCategories = factory.getAll(SubCategoryModel);
exports.getSubCategory   = factory.getOne(SubCategoryModel);
exports.createSubCategory = factory.createOne(SubCategoryModel);
exports.updateSubCategory = factory.updateOne(SubCategoryModel);
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
