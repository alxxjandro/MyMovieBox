const { Router } = require("express");
const directorRouter = Router();
const directorController = require("../controllers/directorController");

directorRouter.get("/:name", directorController.directorGetByID);

module.exports = directorRouter;
