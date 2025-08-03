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
  "The Intouchables"
];

const fetchMovie = async (search, container) => {
  try{
    let f = await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${encodeURIComponent(search)}`);
    let data = await f.json();
    if (data.Response === "True") {
      let movie = {
        title: data.Title,
        year: data.Year,
        genres: Array.from(data.Genre.split(" ")).map(genre => genre.replace(/(^,)|(,$)/g, "")),
        director: data.Director.trim(),
        img: data.Poster,
        rating: data.imdbRating
      }
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
      console.log(`Processing movie: ${m.title}`);

      if (!(await directorExist(m.director))) {
        console.log(`Adding a new director: ${m.director}`);
        await pool.query("INSERT INTO director (name) VALUES ($1)", [m.director]);
      }

      if (!(await movieExist(m.title))) {
        await pool.query(
          "INSERT INTO movie (name, imgurl, year, id_director) VALUES ($1, $2, $3, (SELECT id FROM director WHERE name = $4))",
          [m.title, m.img, m.year, m.director]
        );
      } else {
        console.log(`Movie: ${m.title} already exist!`);
      }

    } catch (e) {
      console.error("An error occurred:", e);
    }
  }
};

const directorExist = async (name) => {
  const { rows } = await pool.query("SELECT * FROM director WHERE name = ($1)", [name]);
  return rows.length === 0 ? false : true;
}

const movieExist = async (name) =>{
  const { rows } = await pool.query("SELECT * FROM movie WHERE name = ($1)", [name]);
  return rows.length === 0 ? false : true;
}

const main = async () => {
  const movies = await fetchAllMovies()
  await populateDB(movies);
  await pool.end();
}
main();

