const { Router } = require("express");
const collectionsRouter = Router();
const collectionsController = require("../controllers/collectionsController");

collectionsRouter.get("/", collectionsController.collectionsGet);
collectionsRouter.get("/:id", collectionsController.collectionsGetById);

module.exports = collectionsRouter;
