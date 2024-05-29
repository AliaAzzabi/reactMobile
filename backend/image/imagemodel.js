const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Image", ImageSchema);
