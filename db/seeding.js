
const movies = [
  "Inception",
  // "Titanic",
  // "The Godfather",
  // "Pulp Fiction",
  // "The Dark Knight",
  // "Forrest Gump",
  // "The Matrix",
  // "The Shawshank Redemption",
  // "Fight Club",
  // "Interstellar",
  // "Gladiator",
  // "Parasite",
  // "La La Land",
  // "Joker",
  // "Avengers: Endgame",
  // "The Lord of the Rings",
  // "The Silence of the Lambs",
  // "Saving Private Ryan",
  // "Coco",
  // "Amélie",
  // "Whiplash",
  // "The Social Network",
  // "Shrek",
  // "Spider-Man: No Way Home",
  // "Toy Story",
  // "Inside Out",
  // "Your Name",
  // "El laberinto del fauno",
  // "The Truman Show",
  // "The Grand Budapest Hotel",
  // "Up",
  // "The Lion King",
  // "Back to the Future",
  // "The Prestige",
  // "The Green Mile",
  // "The Revenant",
  // "Her",
  // "Black Swan",
  // "Frozen",
  // "Gravity",
  // "1917",
  // "The Pursuit of Happyness",
  // "Slumdog Millionaire",
  // "Finding Nemo",
  // "The Hunger Games",
  // "Pirates of the Caribbean",
  // "Deadpool",
  // "The Wolf of Wall Street",
  // "A Beautiful Mind",
  // "The Intouchables"
];
const moviesInfo = [];

const fetchMovie = async (search) => {
  try{
    // console.log(`Fetching the movie - ${search}`);
    let f = await fetch(`https://www.omdbapi.com/?apikey=${process.env.API_KEY}&t=${encodeURIComponent(search)}`);
    let data = await f.json();
    if (data.Response === "True") {
      moviesInfo.push({
        title: data.Title,
        year: data.Year,
        genres: Array.from(data.Genre.split(" ")).map(genre => genre.replace(/(^,)|(,$)/g, "")),
        director: data.Director,
        img: data.Poster,
        rating: data.imdbRating
      })
    } 
  } catch (e) {
    console.error(`Error while fetching the movie - ${search} - ${e}`);
  }
};

const fetchAllMovies = async () => {
  const promises = movies.map((title) => fetchMovie(title));
  await Promise.all(promises);
  console.log(moviesInfo);
  console.log(moviesInfo.length);
};

fetchAllMovies();