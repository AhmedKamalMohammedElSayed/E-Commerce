const mongoose = require("mongoose");

//1-Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category required"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true },
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

categorySchema.post("init", (doc) => {
  setImageURL(doc);
});

categorySchema.post("save", (doc) => {
  setImageURL(doc);
});



//2-Create Model
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
