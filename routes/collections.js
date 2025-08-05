const { Router } = require("express");
const collectionsRouter = Router();
const collectionsController = require("../controllers/collectionsController");

collectionsRouter.get("/", collectionsController.collectionsGet);
collectionsRouter.get("/new", collectionsController.collectionsGetNew);
collectionsRouter.get("/:id", collectionsController.collectionsGetById);

collectionsRouter.post("/new", collectionsController.collectionsPostNew);
collectionsRouter.post(
  "/add-movie",
  collectionsController.collectionsPostAddMovie,
);

collectionsRouter.get(
  "/delete/:id",
  collectionsController.collectionDeleteById,
);

collectionsRouter.get(
  "/:collection_id/delete-movie/:movie_id",
  collectionsController.deleteMovieFromCollection,
);

module.exports = collectionsRouter;
