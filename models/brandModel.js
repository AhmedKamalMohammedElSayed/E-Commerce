const { mongoose } = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "brand must be unique"],
      minlength: [3, "Too short Brand Name"],
      maxlength: [32, "Too long Brand Name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamp: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  setImageURL(doc);
});

brandSchema.post("save", (doc) => {
  setImageURL(doc);
});


module.exports = mongoose.model("Brand", brandSchema);
