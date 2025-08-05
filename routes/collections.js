const { Router } = require("express");
const collectionsRouter = Router();
const collectionsController = require("../controllers/collectionsController");

collectionsRouter.get("/", collectionsController.collectionsGet);
collectionsRouter.get("/new", collectionsController.collectionsGetNew);
collectionsRouter.get("/:id", collectionsController.collectionsGetById);

collectionsRouter.post("/new", collectionsController.collectionsPostNew);

collectionsRouter.get(
  "/delete/:id",
  collectionsController.collectionDeleteById,
);

module.exports = collectionsRouter;
