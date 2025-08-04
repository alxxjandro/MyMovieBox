const pool = require("./pool");

const movieNames = [
  "Inception",
  "Titanic",
  "The Godfather",
  "Pulp Fiction",
  "The Dark Knight",
  "Forrest Gump",
  "The Matrix",
  "The Shawshank Redemption",
  "Fight Club",
  "Interstellar",
  "Gladiator",
  "Parasite",
  "La La Land",
  "Joker",
  "Avengers: Endgame",
  "The Lord of the Rings",
  "The Silence of the Lambs",
  "Saving Private Ryan",
  "Coco",
  "Amélie",
  "Whiplash",
  "The Social Network",
  "Shrek",
  "Spider-Man: No Way Home",
  "Toy Story",
  "Inside Out",
  "Your Name",
  "El laberinto del fauno",
  "The Truman Show",
  "The Grand Budapest Hotel",
  "Up",
  "The Lion King",
  "Back to the Future",
  "The Prestige",
  "The Green Mile",
  "The Revenant",
  "Her",
  "Black Swan",
  "Frozen",
  "Gravity",
  "1917",
  "The Pursuit of Happyness",
  "Slumdog Millionaire",
  "Finding Nemo",
  "The Hunger Games",
  "Pirates of the Caribbean",
  "Deadpool",
  "The Wolf of Wall Street",
  "A Beautiful Mind",
  "The Intouchables",
];

const fetchMovie = async (search, container) => {
  try {
    let f = await fetch(
      `https://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${encodeURIComponent(search)}`,
    );
    let data = await f.json();
    if (data.Response === "True") {
      let movie = {
        title: data.Title,
        year: data.Year,
        genres: Array.from(data.Genre.split(" ")).map((genre) =>
          genre.replace(/(^,)|(,$)/g, ""),
        ),
        director: Array.from(data.Director.split(",")).map((genre) =>
          genre.replace(/(^,)|(,$)/g, ""),
        )[0],
        //for simplicity, a movie has only ONE director!
        img: data.Poster,
        rating: data.imdbRating,
      };
      container.push(movie);
    }
  } catch (e) {
    console.error(`Error while fetching the movie - ${search} - ${e}`);
  }
};

const fetchAllMovies = async () => {
  const moviesInfo = [];
  const promises = movieNames.map((title) => fetchMovie(title, moviesInfo));
  await Promise.all(promises);
  return moviesInfo;
};

const populateDB = async (movies) => {
  for (const m of movies) {
    try {
      let movieGenres = [];
      let directorId;
      let movieId;

      if (!(await directorExist(m.director))) {
        let id = await pool.query(
          "INSERT INTO director (name) VALUES ($1) RETURNING id",
          [m.director],
        );
        directorId = id.rows[0].id;
      } else {
        let result = await pool.query(
          "SELECT id FROM director WHERE name = $1",
          [m.director],
        );
        directorId = result.rows[0].id;
      }

      if (!(await movieExist(m.title))) {
        let id = await pool.query(
          "INSERT INTO movie (name, imgurl, year, id_director) VALUES ($1, $2, $3, (SELECT id FROM director WHERE name = $4)) RETURNING id",
          [m.title, m.img, m.year, m.director],
        );
        movieId = id.rows[0].id;
      }

      for (const g of m.genres) {
        let genre;
        if (!(await genreExist(g))) {
          genre = await pool.query(
            "INSERT INTO genre (name) VALUES ($1) RETURNING id",
            [g],
          );
        } else {
          genre = await pool.query("SELECT id FROM genre WHERE name = $1", [g]);
        }
        movieGenres.push(g);
        let relationship = await pool.query(
          "INSERT INTO movie_genre (movie_id, genre_id) VALUES ($1, $2) RETURNING movie_id, genre_id ",
          [movieId, genre.rows[0].id],
        );
      }

      console.log(
        `Movie: ${m.title} \n with ID: ${movieId} \n and director ${m.director} (ID ${directorId}) \n and genres: ${movieGenres} \n processed correctly! \n`,
      );
    } catch (e) {
      console.error("An error occurred:", e);
    }
  }
};

const createCollections = async () => {
  const collectionOne = await pool.query(
    "INSERT INTO collection (name) VALUES ($1) RETURNING id",
    ["must watch's"],
  );
  const collectionTwo = await pool.query(
    "INSERT INTO collection (name) VALUES ($1) RETURNING id",
    ["personal favorites"],
  );

  //hardcode some movies into the collection
  const ids = [1, 2, 3, 4, 5];
  for (const id of ids) {
    await pool.query(
      "INSERT INTO movie_in_collection (movie_id, collection_id) VALUES ($1, $2)",
      [id, collectionOne.rows[0].id],
    );
    await pool.query(
      "INSERT INTO movie_in_collection (movie_id, collection_id) VALUES ($1, $2)",
      [id * 2, collectionTwo.rows[0].id],
    );
  }
};

const directorExist = async (name) => {
  const { rows } = await pool.query(
    "SELECT * FROM director WHERE name = ($1)",
    [name],
  );
  return rows.length === 0 ? false : true;
};

const movieExist = async (name) => {
  const { rows } = await pool.query("SELECT * FROM movie WHERE name = ($1)", [
    name,
  ]);
  return rows.length === 0 ? false : true;
};

const genreExist = async (name) => {
  const { rows } = await pool.query("SELECT * FROM genre WHERE name = ($1)", [
    name,
  ]);
  return rows.length === 0 ? false : true;
};

const main = async () => {
  const movies = await fetchAllMovies();
  await populateDB(movies);
  await createCollections();
  await pool.end();
};
main();
