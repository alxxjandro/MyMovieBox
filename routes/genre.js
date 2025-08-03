const { Router } = require("express");
const genreRouter = Router();
const genreController = require("../controllers/genreController");

genreRouter.get("/:id", genreController.genreGetById);

module.exports = genreRouter;
