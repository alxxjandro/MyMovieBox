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

exports.collectionDeleteById = async (req, res, next) => {
  const id = req.params.id;
  await pool.query("DELETE FROM collection WHERE id = $1", [id]);
  res.redirect("/collections");
};
