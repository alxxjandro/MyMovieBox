const { Router } = require("express");
const moviesRouter = Router();
const moviesController = require("../controllers/moviesController");

moviesRouter.get("/", moviesController.moviesGet);
moviesRouter.get("/:id", moviesController.movieGetById);

module.exports = moviesRouter;
