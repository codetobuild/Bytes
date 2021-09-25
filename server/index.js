const express = require("express");
const app = express();
const methodOverride = require("method-override");

//datbase setup function
const { dbSetup } = require("./db/dbSetup");
dbSetup();

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Routes
const bookRoute = require("./routes/books");
const homeRoute = require("./routes/home");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("public/uploads"));

// route prefix
app.use("/", homeRoute);
app.use("/books", bookRoute);

// server setup
app.listen(process.env.PORT || 5000, () => {
  console.log("listening at 5000");
});
