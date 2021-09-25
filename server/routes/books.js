const express = require("express");
const Router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Book = require("../db/models/book");
const storagePath = "../public/uploads";

const {
  getAllBooks,
  createBook,
  downloadBook,
  viewBook,
  updateBook,
  deleteBook,
} = require("../controllers/book");
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (
//       file.mimetype === "image/jpeg" ||
//       file.mimetype === "image/jpg" ||
//       file.mimetype === "image/png"
//     ) {
//       cb(null, `${__dirname}/${storagePath}/images`);
//     } else {
//       cb(null, `${__dirname}/${storagePath}/pdfFiles`);
//     }
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}_${file.originalname}_${Date.now()}${ext}`);
//   },
// });

// const multerFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "application/pdf"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//     return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//   }
// };
// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// }).fields([
//   {
//     name: "bookCover",
//     maxCount: 1,
//   },
//   {
//     name: "bookFile",
//     maxCount: 1,
//   },
// ]);

// get all notes
Router.get("/", getAllBooks);

// create new note
Router.post("/new", createBook);

// download one book
Router.get("/:id/download", downloadBook);

// get one book
Router.get("/:id", viewBook);

// delete one book
Router.delete("/:id", deleteBook);

// update book
Router.put("/:id", updateBook);

module.exports = Router;
