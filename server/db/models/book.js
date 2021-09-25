const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'description of book'
  },
  pageCount: {
    type: String,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  bookCoverImagePath:{
      type: String,
  },
  bookFilePath:{
      type: String,
      required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", bookSchema);

