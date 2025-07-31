const { Router } = require("express");
const collectionsRouter = Router();
const collectionsController = require("../controllers/collectionsController");

collectionsRouter.get("/", collectionsController.collectionsGet);

module.exports = collectionsRouter;
