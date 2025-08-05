const pool = require("../db/pool");

exports.directorGetByID = async (req, res, next) => {
  const { rows } = await pool.query("SELECT * FROM director WHERE name = $1", [
    req.params.name,
  ]);
  const directorMovies = await pool.query(
    "SELECT id, name, imgurl FROM movie WHERE id_director = $1",
    [rows[0].id],
  );
  res.render("director", {
    director: rows[0].name,
    directorMovies: directorMovies.rows,
  });
};
