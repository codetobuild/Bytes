const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
});

exports.subjectCategory = mongoose.model("subjectCategory", categorySchema);
exports.categorySchema = categorySchema;
