const pool = require("../db/pool");

exports.genreGetById = async (req, res, next) => {
  const genreName = await pool.query("SELECT name FROM genre WHERE id = $1", [
    req.params.id,
  ]);
  //movie ids with matching genres
  const { rows } = await pool.query(
    "SELECT name,movie_id FROM movie_genre JOIN movie ON movie_id = movie.id WHERE genre_id = $1",
    [req.params.id],
  );
  res.render("genre", { genre: genreName.rows[0].name, movies: rows });
};
