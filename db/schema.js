#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
  CREATE TABLE director(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255)
  );

  CREATE TABLE movie (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255),
    imgurl VARCHAR(255),
    year INTEGER,
    id_director INTEGER REFERENCES director(id) ON UPDATE CASCADE ON DELETE CASCADE
  );

  CREATE TABLE genre (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255)
  );

  CREATE TABLE collection(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255)  
  );

  CREATE TABLE movie_genre (
    movie_id INTEGER REFERENCES movie(id) ON UPDATE CASCADE ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genre(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT movie_genre_pkey PRIMARY KEY (movie_id, genre_id)
  );

  CREATE TABLE movie_in_collection (
    movie_id INTEGER REFERENCES movie(id) ON UPDATE CASCADE ON DELETE CASCADE,
    collection_id INTEGER REFERENCES collection(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT movie_in_collection_pkey PRIMARY KEY (movie_id, collection_id)
  );
`;

async function main() {
  console.log("creating schema...");
  const client = new Client({
    connectionString: "postgresql://alonsoparra:@localhost:5432/moviebox",
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
