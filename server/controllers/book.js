const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Book = require("../db/models/book");
// const storagePath = require("../public/uploads");

const uploadFolder = path.join(__dirname, "../public/uploads");

// multer config
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, `${uploadFolder}/images`);
    } else {
      cb(null, `${uploadFolder}/pdfFiles`);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${file.originalname}_${Date.now()}${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).fields([
  {
    name: "bookCover",
    maxCount: 1,
  },
  {
    name: "bookFile",
    maxCount: 1,
  },
]);

// route handlers
exports.getAllBooks = async (req, res) => {
  console.log("get  all obasdfas");
  const books = await Book.find({});
  res.json({ data: books, error: null });
};

exports.createBook = async (req, res) => {
  upload(req, res, async function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.files) {
      return res.json({ error: "select valid file type" });
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      console.log(err);
      return res.json({ error: err });
    }

    const data = { ...req.body };
    const files = { ...req.files };
    console.log(files);
    console.log(data);

    const newBookPayload = {
      title: data.title,
      category: data.category,
      pageCount: data.pageCount,
      description: data.description,
      bookCoverImagePath: files.bookCover[0].filename,
      bookFilePath: files.bookFile[0].filename,
    };

    const newBook = await Book.create(newBookPayload);
    console.log(newBook);
    res.json({ data: newBook, error: null });
    //     res.send(
    //       `<img src=/images/${newBookPayload.bookCoverImagePath}></img>`
    //     );
  });
};

exports.downloadBook = async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  //   res.send('download')
  res.download(`public/uploads/pdfFiles/${book.bookFilePath}`);
};

exports.viewBook = async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  res.json({ data: book, error: null });
};

exports.deleteBook = async (req, res) => {
  const bookId = req.params.id;
  const data = await Book.findById(bookId);

  const pathToImageFile = path.join(
    uploadFolder,
    `/images`,
    `${data.bookCoverImagePath}`
  );
  const pathToPdfFile = path.join(
    uploadFolder,
    `/pdfFiles`,
    `${data.bookFilePath}`
  );
  console.log(data);
  try {
    await fs.unlinkSync(pathToImageFile);
    await fs.unlinkSync(pathToPdfFile);

    await Book.deleteOne({ id: data._id });
    console.log(data);
    return res.json({ data: data, error: null });
  } catch (err) {
    return res.json({ error: err });
  }
};

exports.updateBook = async (req, res) => {
  const bookId = req.params.id;

  upload(req, res, async function (err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.files) {
      return res.json({ error: "select valid file type" });
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      console.log(err);
      return res.json({ error: err });
    }
    const data = { ...req.body };
    const files = { ...req.files };
    console.log("------------------------");
    console.log(files);
    try {
      const book = await Book.findById(bookId);
      console.log("data", book);

      book.title = data.title || book.title;
      book.category = data.category || book.category;
      book.pageCount = data.pageCount || book.pageCount;

      const pathToImageFile = path.join(
        uploadFolder,
        `/images`,
        `${book.bookCoverImagePath}`
      );
      const pathToPdfFile = path.join(
        uploadFolder,
        `/pdfFiles`,
        `${book.bookFilePath}`
      );
      if (files.bookCover) {
        await fs.unlinkSync(pathToImageFile);
        book.bookCoverImagePath = files.bookCover[0].filename;
      }
      if (files.bookFile) {
        await fs.unlinkSync(pathToPdfFile);
        book.bookFilePath = files.bookFile[0].filename;
      }

      const updated = await book.save();
      console.log("newBookPayload", updated);

      // const newBook = await Book.create(newBookPayload);
      // console.log(newBook);
      // res.json({ data: newBook, error: null });
      res.json({ data: updated, error: null });
    } catch (err) {
      console.log(err);
      res.json({ error: err });
    }
  });
};
