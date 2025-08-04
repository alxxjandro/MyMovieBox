const pool = require("../db/pool");

exports.collectionsGet = async (req, res, next) => {
  // const collections = await pool.query("SELECT c.name, m.collection_id, m.movie_id, mo.name FROM collection AS c JOIN movie_in_collection AS m ON c.id = m.collection_id JOIN movie AS mo ON m.movie_id = mo.id ORDER BY m.collection_id ASC")
  const collections = await pool.query("SELECT * FROM collection");
  // const collectionsArray = [];
  // for (const collection of collections.rows){
  //   let q = await pool.query("SELECT c.name AS collection, c.id, m.movie_id, mo.name AS movie_name FROM collection AS c JOIN movie_in_collection AS m ON c.id = m.collection_id JOIN movie AS mo ON m.movie_id = mo.id WHERE c.id = $1",[collection.id]);
  //   collectionsArray.push(q.rows);
  // }

  // collectionsArray.map(collection => console.log(collection));
  res.render("collections", { collections: collections.rows });
};

exports.collectionsGetById = async (req, res, next) => {
  const id = req.params.id;
  const collectionsMovies = await pool.query(
    "SELECT c.name AS collection, c.id, m.movie_id, mo.name AS movie_name FROM collection AS c JOIN movie_in_collection AS m ON c.id = m.collection_id JOIN movie AS mo ON m.movie_id = mo.id WHERE c.id = $1",
    [id],
  );
  // console.log(collectionsMovies.rows)
  res.render("collectionInfo", { movies: collectionsMovies.rows });
};
