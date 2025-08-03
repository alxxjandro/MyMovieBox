const pool = require("../db/pool");

exports.moviesGet = async (req, res, next) => {
  const { rows } = await pool.query("SELECT * FROM movie");
  res.render("movies", { movies: rows });
};

exports.movieGetById = async (req, res, next) => {
  const { rows } = await pool.query("SELECT * FROM movie WHERE id = $1", [
    req.params.id,
  ]);
  const director = await pool.query("SELECT name FROM director WHERE id = $1", [
    rows[0].id_director,
  ]);
  const genresIDs = await pool.query(
    "SELECT genre_id FROM movie_genre WHERE movie_id = $1",
    [req.params.id],
  );

  //re-build the genre name-id relationship
  let genresInfo = [];
  for (const g of genresIDs.rows) {
    const name = await pool.query("SELECT * FROM genre WHERE id = $1", [
      g.genre_id,
    ]);
    genresInfo.push({
      name: name.rows[0].name,
      id: g.genre_id,
    });
  }

  res.render("movieDetail", {
    movie: rows[0],
    director: director.rows[0].name,
    directorURL: encodeURIComponent(director.rows[0].name),
    genres: genresInfo,
  });
};
