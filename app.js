const express = require("express");
const app = express();
const homeRouter = require("./routes/home");
const moviesRouter = require("./routes/movies");
const collectionsRouter = require("./routes/collections");
const errorRouter = require("./routes/error");
const directorRouter = require("./routes/director");
const genreRouter = require("./routes/genre");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use("/", homeRouter);
app.use("/movies", moviesRouter);
app.use("/collections", collectionsRouter);
app.use("/director", directorRouter);
app.use("/genre", genreRouter);
app.use("/:error", errorRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
