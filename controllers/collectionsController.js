const pool = require("../db/pool");

exports.collectionsGet = async (req, res, next) => {
  const collections = await pool.query("SELECT * FROM collection");
  res.render("collections", { collections: collections.rows });
};

exports.collectionsGetNew = async (req, res, next) => {
  res.render("newCollection");
};

exports.collectionsGetById = async (req, res, next) => {
  const id = req.params.id;
  const collectionsMovies = await pool.query(
    "SELECT c.name AS collection, c.id, m.movie_id, mo.name AS movie_name FROM collection AS c JOIN movie_in_collection AS m ON c.id = m.collection_id JOIN movie AS mo ON m.movie_id = mo.id WHERE c.id = $1",
    [id],
  );

  if (!collectionsMovies.rows.length) {
    const name = await pool.query("SELECT name FROM collection WHERE id = $1", [
      id,
    ]);
    res.render("collectionInfo", { name: name.rows[0].name, movies: false });
    return;
  }
  res.render("collectionInfo", {
    name: collectionsMovies.rows[0].name,
    movies: collectionsMovies.rows,
  });
};

exports.collectionsPostNew = async (req, res, next) => {
  const name = req.body.name;
  await pool.query("INSERT INTO collection (name) VALUES ($1)", [name]);
  res.redirect("/collections");
};

exports.collectionsPostAddMovie = async (req, res, next) => {
  const { movie_id, collection_id } = req.body;

  try {
    const check = await pool.query(
      "SELECT * FROM movie_in_collection WHERE movie_id = $1 AND collection_id = $2",
      [movie_id, collection_id],
    );

    if (check.rows.length) {
      res.redirect("/movies?added=false");
    } else {
      await pool.query(
        "INSERT INTO movie_in_collection (movie_id, collection_id) VALUES ($1, $2)",
        [movie_id, collection_id],
      );
      res.redirect("/movies?added=true");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/movies?added=error");
  }
};

exports.collectionDeleteById = async (req, res, next) => {
  const id = req.params.id;
  await pool.query("DELETE FROM collection WHERE id = $1", [id]);
  res.redirect("/collections");
};

exports.deleteMovieFromCollection = async (req, res, next) => {
  const { collection_id, movie_id } = req.params;
  await pool.query(
    "DELETE FROM movie_in_collection WHERE collection_id = $1 AND movie_id = $2",
    [collection_id, movie_id],
  );
  res.redirect(`/collections/${collection_id}`);
};
